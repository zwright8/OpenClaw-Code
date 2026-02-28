import { randomUUID } from 'crypto';
import { TaskReceipt, TaskRequest, TaskResult } from './schemas.js';

const TERMINAL_STATUSES = new Set([
    'completed',
    'partial',
    'failed',
    'rejected',
    'timed_out',
    'transport_error'
]);

const OPEN_STATUSES = new Set([
    'created',
    'dispatched',
    'acknowledged',
    'retry_scheduled'
]);

const APPROVAL_PENDING_STATUS = 'awaiting_approval';
const DEFAULT_MAX_RETRY_DELAY_MULTIPLIER = 32;
const DEFAULT_RETRY_JITTER_RATIO = 0.2;
const RETRY_CYCLE_GUARD_MULTIPLIER = 4;

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function safeNow(nowFn) {
    const value = Number(nowFn());
    return Number.isFinite(value) ? value : Date.now();
}

function safeNonNegativeInteger(value, fallback = 0) {
    return Number.isInteger(value) && value >= 0 ? value : fallback;
}

function safeNonNegativeNumber(value, fallback = 0) {
    return Number.isFinite(value) && value >= 0 ? Number(value) : fallback;
}

function stableHash(value) {
    const input = String(value ?? '');
    let hash = 2166136261;
    for (let idx = 0; idx < input.length; idx += 1) {
        hash ^= input.charCodeAt(idx);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}

function stableUnitInterval(seed) {
    return stableHash(seed) / 0xffffffff;
}

function ensureRetryLifecycle(record, fallbackMaxRetries = 0) {
    const maxRetries = safeNonNegativeInteger(record?.maxRetries, fallbackMaxRetries);
    const minGuardCycles = Math.max(1, (maxRetries + 1) * RETRY_CYCLE_GUARD_MULTIPLIER);
    const existing = record?.retryLifecycle;

    const lifecycle = existing && typeof existing === 'object'
        ? existing
        : {
            state: 'idle',
            scheduledCount: 0,
            dispatchCount: 0,
            consecutiveFailures: 0,
            maxCycles: minGuardCycles,
            lastReason: null,
            lastDelayMs: null,
            nextRetryAt: null,
            terminalReason: null,
            lastTransitionAt: null
        };

    lifecycle.state = typeof lifecycle.state === 'string' && lifecycle.state.trim()
        ? lifecycle.state
        : 'idle';
    lifecycle.scheduledCount = safeNonNegativeInteger(lifecycle.scheduledCount, 0);
    lifecycle.dispatchCount = safeNonNegativeInteger(lifecycle.dispatchCount, 0);
    lifecycle.consecutiveFailures = safeNonNegativeInteger(lifecycle.consecutiveFailures, 0);
    lifecycle.maxCycles = Math.max(
        minGuardCycles,
        safeNonNegativeInteger(lifecycle.maxCycles, minGuardCycles)
    );
    lifecycle.lastReason = lifecycle.lastReason ?? null;
    lifecycle.lastDelayMs = Number.isFinite(lifecycle.lastDelayMs)
        ? Number(lifecycle.lastDelayMs)
        : null;
    lifecycle.nextRetryAt = Number.isFinite(lifecycle.nextRetryAt)
        ? Number(lifecycle.nextRetryAt)
        : null;
    lifecycle.terminalReason = lifecycle.terminalReason ?? null;
    lifecycle.lastTransitionAt = Number.isFinite(lifecycle.lastTransitionAt)
        ? Number(lifecycle.lastTransitionAt)
        : null;

    if (record && typeof record === 'object') {
        record.retryLifecycle = lifecycle;
        record.maxRetries = maxRetries;
    }

    return lifecycle;
}

export function buildTaskRequest({
    from,
    target,
    task,
    priority = 'normal',
    context,
    constraints,
    id = randomUUID(),
    createdAt = Date.now()
}) {
    return TaskRequest.parse({
        kind: 'task_request',
        id,
        from,
        target,
        priority,
        task,
        context,
        constraints,
        createdAt
    });
}

export function buildTaskReceipt({
    taskId,
    from,
    accepted,
    reason,
    etaMs,
    timestamp = Date.now()
}) {
    return TaskReceipt.parse({
        kind: 'task_receipt',
        taskId,
        from,
        accepted,
        reason,
        etaMs,
        timestamp
    });
}

export function buildTaskResult({
    taskId,
    from,
    status,
    output,
    artifacts,
    metrics,
    completedAt = Date.now()
}) {
    return TaskResult.parse({
        kind: 'task_result',
        taskId,
        from,
        status,
        output,
        artifacts,
        metrics,
        completedAt
    });
}

export class TaskOrchestratorError extends Error {
    constructor(code, message, details = {}) {
        super(message);
        this.name = 'TaskOrchestratorError';
        this.code = code;
        this.details = details;
    }
}

export class TaskOrchestrator {
    constructor({
        localAgentId,
        transport,
        routeTask = null,
        dispatchPolicy = null,
        approvalPolicy = null,
        auditLog = null,
        store = null,
        defaultTimeoutMs = 30_000,
        maxRetries = 1,
        retryDelayMs = 500,
        maxRetryDelayMs = null,
        retryJitterRatio = DEFAULT_RETRY_JITTER_RATIO,
        now = Date.now,
        logger = console
    }) {
        if (!localAgentId || typeof localAgentId !== 'string') {
            throw new TaskOrchestratorError('INVALID_OPTIONS', 'localAgentId is required');
        }

        if (!transport || typeof transport.send !== 'function') {
            throw new TaskOrchestratorError(
                'INVALID_TRANSPORT',
                'transport must expose send(targetAgentId, message)'
            );
        }

        this.localAgentId = localAgentId;
        this.transport = transport;
        this.routeTask = typeof routeTask === 'function' ? routeTask : null;
        this.dispatchPolicy = typeof dispatchPolicy === 'function' ? dispatchPolicy : null;
        this.approvalPolicy = typeof approvalPolicy === 'function' ? approvalPolicy : null;
        this.auditLog = auditLog && typeof auditLog.append === 'function' ? auditLog : null;
        this.store = store && typeof store === 'object' ? store : null;
        this.defaultTimeoutMs = Number.isFinite(defaultTimeoutMs) && defaultTimeoutMs > 0
            ? Number(defaultTimeoutMs)
            : 30_000;
        this.maxRetries = safeNonNegativeInteger(maxRetries, 1);
        this.retryDelayMs = safeNonNegativeNumber(retryDelayMs, 500);
        const defaultMaxRetryDelayMs = this.retryDelayMs * DEFAULT_MAX_RETRY_DELAY_MULTIPLIER;
        this.maxRetryDelayMs = maxRetryDelayMs === null || maxRetryDelayMs === undefined
            ? defaultMaxRetryDelayMs
            : safeNonNegativeNumber(maxRetryDelayMs, defaultMaxRetryDelayMs);
        this.retryJitterRatio = Number.isFinite(retryJitterRatio) && retryJitterRatio >= 0
            ? Math.min(Number(retryJitterRatio), 1)
            : DEFAULT_RETRY_JITTER_RATIO;
        this.now = typeof now === 'function' ? now : Date.now;
        this.logger = logger;
        this.tasks = new Map();
        this._persistenceQueue = Promise.resolve();
    }

    async hydrate({ replace = true } = {}) {
        if (!this.store || typeof this.store.loadRecords !== 'function') {
            return {
                loaded: 0
            };
        }

        const loaded = await this.store.loadRecords();
        if (!Array.isArray(loaded)) {
            throw new TaskOrchestratorError('INVALID_STORE_DATA', 'loadRecords() must return an array');
        }

        if (replace) {
            this.tasks.clear();
        }

        let applied = 0;
        for (const record of loaded) {
            if (!record || typeof record !== 'object' || typeof record.taskId !== 'string') {
                continue;
            }

            const hydrated = clone(record);
            hydrated.attempts = safeNonNegativeInteger(hydrated.attempts, 0);
            hydrated.maxRetries = safeNonNegativeInteger(hydrated.maxRetries, this.maxRetries);
            ensureRetryLifecycle(hydrated, this.maxRetries);

            this.tasks.set(hydrated.taskId, hydrated);
            applied++;
        }

        return {
            loaded: applied
        };
    }

    _enqueuePersistence(operation, label) {
        if (!this.store || typeof operation !== 'function') return;

        this._persistenceQueue = this._persistenceQueue
            .then(async () => {
                await operation();
            })
            .catch((error) => {
                this.logger.warn?.(
                    `[Swarm] Persistence operation failed (${label}): ${error.message}`
                );
            });
    }

    _persistRecord(record) {
        if (!this.store || typeof this.store.saveRecord !== 'function') return;
        const payload = clone(record);
        this._enqueuePersistence(
            () => this.store.saveRecord(payload),
            'saveRecord'
        );
    }

    _deleteRecord(taskId) {
        if (!this.store || typeof this.store.deleteRecord !== 'function') return;
        this._enqueuePersistence(
            () => this.store.deleteRecord(taskId),
            'deleteRecord'
        );
    }

    _emitAudit(eventType, payload, at = safeNow(this.now)) {
        if (!this.auditLog) return;

        try {
            this.auditLog.append({
                eventType,
                at,
                actor: this.localAgentId,
                payload: clone(payload)
            });
        } catch (error) {
            this.logger.warn?.(
                `[Swarm] Audit append failed (${eventType}): ${error.message}`
            );
        }
    }

    async flush() {
        await this._persistenceQueue;
    }

    _normalizeRetryLifecycle(record) {
        if (!record || typeof record !== 'object') return null;

        record.attempts = safeNonNegativeInteger(record.attempts, 0);
        record.maxRetries = safeNonNegativeInteger(record.maxRetries, this.maxRetries);

        return ensureRetryLifecycle(record, this.maxRetries);
    }

    _setRetryLifecycleState(record, state, at, details = {}) {
        const lifecycle = this._normalizeRetryLifecycle(record);
        if (!lifecycle) return null;

        const changed = lifecycle.state !== state;
        lifecycle.state = state;
        lifecycle.lastTransitionAt = at;

        if (Object.prototype.hasOwnProperty.call(details, 'reason')) {
            lifecycle.lastReason = details.reason ?? null;
        }

        if (Object.prototype.hasOwnProperty.call(details, 'delayMs')) {
            lifecycle.lastDelayMs = Number.isFinite(details.delayMs)
                ? Number(details.delayMs)
                : null;
        }

        if (Object.prototype.hasOwnProperty.call(details, 'nextRetryAt')) {
            lifecycle.nextRetryAt = Number.isFinite(details.nextRetryAt)
                ? Number(details.nextRetryAt)
                : null;
        }

        if (Object.prototype.hasOwnProperty.call(details, 'terminalReason')) {
            lifecycle.terminalReason = details.terminalReason ?? null;
        }

        if (changed || details.forceHistory === true) {
            record.history.push({
                at,
                event: 'retry_state',
                state,
                reason: lifecycle.lastReason,
                delayMs: lifecycle.lastDelayMs,
                nextRetryAt: lifecycle.nextRetryAt,
                terminalReason: lifecycle.terminalReason
            });
        }

        return lifecycle;
    }

    _isRetryCycleExhausted(record) {
        const lifecycle = this._normalizeRetryLifecycle(record);
        if (!lifecycle) return true;
        return lifecycle.scheduledCount >= lifecycle.maxCycles;
    }

    _terminalizeRecordForRetry(record, {
        nowMs,
        status,
        event,
        reason,
        auditEvent,
        auditPayload
    }) {
        this._setRetryLifecycleState(record, 'terminalized', nowMs, {
            reason,
            terminalReason: reason,
            nextRetryAt: null,
            forceHistory: true
        });

        record.status = status;
        record.updatedAt = nowMs;
        record.closedAt = nowMs;
        record.nextRetryAt = null;
        record.history.push({
            at: nowMs,
            event,
            reason,
            error: record.lastError
        });
        this._persistRecord(record);
        this._emitAudit(auditEvent, {
            taskId: record.taskId,
            target: record.target,
            attempts: record.attempts,
            ...(auditPayload || {})
        }, nowMs);
    }

    async dispatchTask({
        target,
        task,
        priority = 'normal',
        context,
        constraints,
        id = randomUUID(),
        createdAt = safeNow(this.now)
    }) {
        const routingDraft = buildTaskRequest({
            from: this.localAgentId,
            target,
            task,
            priority,
            context,
            constraints,
            id,
            createdAt
        });

        let resolvedTarget = target;
        if (!resolvedTarget && this.routeTask) {
            const routed = await this.routeTask(routingDraft);
            if (typeof routed === 'string' && routed.trim()) {
                resolvedTarget = routed;
            } else if (routed && typeof routed === 'object') {
                if (typeof routed.target === 'string' && routed.target.trim()) {
                    resolvedTarget = routed.target;
                } else if (typeof routed.selectedAgentId === 'string' && routed.selectedAgentId.trim()) {
                    resolvedTarget = routed.selectedAgentId;
                } else if (typeof routed.taskRequest?.target === 'string' && routed.taskRequest.target.trim()) {
                    resolvedTarget = routed.taskRequest.target;
                }
            }
        }

        if (!resolvedTarget || typeof resolvedTarget !== 'string') {
            throw new TaskOrchestratorError(
                'MISSING_TARGET',
                'Task target is required (or provide a routeTask function that resolves one)'
            );
        }

        let request = buildTaskRequest({
            from: this.localAgentId,
            target: resolvedTarget,
            task,
            priority,
            context,
            constraints,
            id,
            createdAt
        });

        let policyDecision = null;
        if (this.dispatchPolicy) {
            const decision = await this.dispatchPolicy(request);
            if (decision === false) {
                this._emitAudit('task_policy_denied', {
                    taskId: request.id,
                    target: request.target,
                    reasons: [{ code: 'policy_denied', reason: 'dispatch_policy_returned_false' }]
                }, request.createdAt);
                throw new TaskOrchestratorError(
                    'POLICY_DENIED',
                    `Task ${request.id} denied by dispatch policy`,
                    {
                        taskId: request.id,
                        reasons: [{ code: 'policy_denied', reason: 'dispatch_policy_returned_false' }]
                    }
                );
            }

            if (decision && typeof decision === 'object') {
                const allowed = decision.allowed !== false && decision.decision !== 'deny';
                const reasons = Array.isArray(decision.reasons) ? decision.reasons : [];
                const redactions = Array.isArray(decision.redactions) ? decision.redactions : [];

                if (decision.taskRequest && typeof decision.taskRequest === 'object') {
                    request = buildTaskRequest({
                        ...request,
                        ...decision.taskRequest,
                        id: request.id,
                        from: request.from,
                        target: request.target,
                        createdAt: request.createdAt
                    });
                }

                policyDecision = {
                    allowed,
                    reasons: clone(reasons),
                    redactions: clone(redactions)
                };

                if (!allowed) {
                    this._emitAudit('task_policy_denied', {
                        taskId: request.id,
                        target: request.target,
                        reasons
                    }, request.createdAt);
                    throw new TaskOrchestratorError(
                        'POLICY_DENIED',
                        `Task ${request.id} denied by dispatch policy`,
                        {
                            taskId: request.id,
                            reasons
                        }
                    );
                }
            }
        }

        const record = {
            taskId: request.id,
            target: request.target,
            request,
            status: 'created',
            approval: null,
            policy: policyDecision,
            attempts: 0,
            maxRetries: this.maxRetries,
            retryLifecycle: {
                state: 'idle',
                scheduledCount: 0,
                dispatchCount: 0,
                consecutiveFailures: 0,
                maxCycles: Math.max(1, (this.maxRetries + 1) * RETRY_CYCLE_GUARD_MULTIPLIER),
                lastReason: null,
                lastDelayMs: null,
                nextRetryAt: null,
                terminalReason: null,
                lastTransitionAt: request.createdAt
            },
            createdAt: request.createdAt,
            updatedAt: request.createdAt,
            deadlineAt: request.createdAt + this.defaultTimeoutMs,
            nextRetryAt: null,
            closedAt: null,
            lastError: null,
            receipts: [],
            result: null,
            history: [
                { at: request.createdAt, event: 'created' }
            ]
        };
        this._normalizeRetryLifecycle(record);

        if (policyDecision?.redactions?.length > 0) {
            record.history.push({
                at: request.createdAt,
                event: 'policy_redacted',
                redactionCount: policyDecision.redactions.length
            });
        }

        if (this.approvalPolicy) {
            const decision = await this.approvalPolicy(request);
            if (decision?.required) {
                record.status = APPROVAL_PENDING_STATUS;
                record.approval = {
                    status: 'pending',
                    reviewerGroup: decision.reviewerGroup || null,
                    reason: decision.reason || 'approval_required',
                    matchedRules: Array.isArray(decision.matchedRules) ? decision.matchedRules : [],
                    requestedAt: createdAt,
                    reviewedAt: null,
                    reviewer: null,
                    reviewReason: null
                };
                record.history.push({
                    at: createdAt,
                    event: 'approval_requested',
                    reason: record.approval.reason
                });
            }
        }

        this.tasks.set(record.taskId, record);
        this._persistRecord(record);
        this._emitAudit('task_created', {
            taskId: record.taskId,
            target: record.target,
            status: record.status,
            priority: record.request.priority,
            policyRedactions: record.policy?.redactions?.length || 0
        }, record.createdAt);

        if (record.status === APPROVAL_PENDING_STATUS) {
            this._emitAudit('task_awaiting_approval', {
                taskId: record.taskId,
                reviewerGroup: record.approval?.reviewerGroup || null,
                reason: record.approval?.reason || null
            }, record.updatedAt);
            return this.getTask(record.taskId);
        }

        try {
            await this._sendTask(record, 'initial_dispatch');
        } catch (error) {
            this.tasks.delete(record.taskId);
            this._deleteRecord(record.taskId);
            throw error;
        }

        return this.getTask(record.taskId);
    }

    async reviewTask(taskId, decision = {}) {
        const record = this.tasks.get(taskId);
        if (!record) return null;
        if (record.status !== APPROVAL_PENDING_STATUS) {
            throw new TaskOrchestratorError(
                'NOT_AWAITING_APPROVAL',
                `Task ${taskId} is not waiting for approval`
            );
        }

        const approved = decision.approved === true;
        const reviewedAt = Number.isFinite(Number(decision.reviewedAt))
            ? Number(decision.reviewedAt)
            : safeNow(this.now);

        record.updatedAt = reviewedAt;
        record.approval = {
            ...(record.approval || {}),
            status: approved ? 'approved' : 'denied',
            reviewedAt,
            reviewer: decision.reviewer || null,
            reviewReason: decision.reason || null
        };

        if (!approved) {
            record.status = 'rejected';
            record.closedAt = reviewedAt;
            this._setRetryLifecycleState(record, 'terminalized', reviewedAt, {
                reason: decision.reason || 'approval_denied',
                terminalReason: 'approval_denied',
                nextRetryAt: null,
                forceHistory: true
            });
            record.history.push({
                at: reviewedAt,
                event: 'approval_denied',
                reason: decision.reason || 'denied'
            });
            this._persistRecord(record);
            this._emitAudit('task_approval_denied', {
                taskId: record.taskId,
                reviewer: record.approval.reviewer,
                reason: record.approval.reviewReason
            }, reviewedAt);
            return this.getTask(taskId);
        }

        record.status = 'created';
        record.history.push({
            at: reviewedAt,
            event: 'approval_approved'
        });
        this._persistRecord(record);
        this._emitAudit('task_approval_approved', {
            taskId: record.taskId,
            reviewer: record.approval.reviewer,
            reason: record.approval.reviewReason
        }, reviewedAt);

        try {
            await this._sendTask(record, 'approval_release');
        } catch (error) {
            record.updatedAt = reviewedAt;
            record.history.push({
                at: reviewedAt,
                event: 'approval_release_failed',
                error: error.message
            });

            this._scheduleRetry(record, reviewedAt, 'approval_release_failed');
        }

        return this.getTask(taskId);
    }

    async _sendTask(record, reason) {
        const sendAt = safeNow(this.now);
        const lifecycle = this._normalizeRetryLifecycle(record);

        if (reason === 'timeout_retry' || reason === 'transport_failure_retry' || reason === 'approval_release_failed') {
            lifecycle.dispatchCount += 1;
            this._setRetryLifecycleState(record, 'dispatching', sendAt, {
                reason,
                forceHistory: true
            });
        }

        record.attempts += 1;
        record.updatedAt = sendAt;
        record.history.push({
            at: sendAt,
            event: 'send_attempt',
            reason,
            attempt: record.attempts
        });
        this._emitAudit('task_send_attempt', {
            taskId: record.taskId,
            target: record.target,
            reason,
            attempt: record.attempts
        }, sendAt);

        try {
            await this.transport.send(record.target, record.request);
            record.status = 'dispatched';
            record.deadlineAt = sendAt + this.defaultTimeoutMs;
            record.nextRetryAt = null;
            record.lastError = null;
            lifecycle.consecutiveFailures = 0;
            this._setRetryLifecycleState(record, 'idle', sendAt, {
                reason,
                nextRetryAt: null
            });
            record.history.push({
                at: safeNow(this.now),
                event: 'send_success',
                attempt: record.attempts
            });
            this._persistRecord(record);
            this._emitAudit('task_send_success', {
                taskId: record.taskId,
                target: record.target,
                attempt: record.attempts
            }, record.updatedAt);
        } catch (error) {
            const message = error?.message || 'Failed to dispatch task';
            lifecycle.consecutiveFailures += 1;
            record.lastError = message;
            record.updatedAt = safeNow(this.now);
            record.history.push({
                at: record.updatedAt,
                event: 'send_failed',
                attempt: record.attempts,
                error: message
            });
            this._persistRecord(record);
            this._emitAudit('task_send_failed', {
                taskId: record.taskId,
                target: record.target,
                attempt: record.attempts,
                error: message
            }, record.updatedAt);
            throw new TaskOrchestratorError('SEND_FAILED', message, {
                taskId: record.taskId,
                target: record.target,
                attempt: record.attempts,
                cause: error
            });
        }
    }

    ingestReceipt(receiptPayload) {
        const receipt = TaskReceipt.parse(receiptPayload);
        const record = this.tasks.get(receipt.taskId);
        if (!record) return false;
        if (TERMINAL_STATUSES.has(record.status)) return false;

        record.receipts.push(receipt);
        record.updatedAt = receipt.timestamp;

        if (!receipt.accepted) {
            record.status = 'rejected';
            record.closedAt = receipt.timestamp;
            this._setRetryLifecycleState(record, 'terminalized', receipt.timestamp, {
                reason: receipt.reason || 'rejected_by_worker',
                terminalReason: 'rejected_by_worker',
                nextRetryAt: null,
                forceHistory: true
            });
            record.history.push({
                at: receipt.timestamp,
                event: 'rejected',
                reason: receipt.reason || 'rejected_by_worker'
            });
            this._persistRecord(record);
            this._emitAudit('task_rejected', {
                taskId: record.taskId,
                from: receipt.from,
                reason: receipt.reason || 'rejected_by_worker'
            }, receipt.timestamp);
            return true;
        }

        record.status = 'acknowledged';
        if (Number.isFinite(receipt.etaMs)) {
            record.deadlineAt = receipt.timestamp + Number(receipt.etaMs);
        }
        record.history.push({
            at: receipt.timestamp,
            event: 'acknowledged',
            etaMs: receipt.etaMs ?? null
        });
        this._persistRecord(record);
        this._emitAudit('task_acknowledged', {
            taskId: record.taskId,
            from: receipt.from,
            etaMs: receipt.etaMs ?? null
        }, receipt.timestamp);
        return true;
    }

    ingestResult(resultPayload) {
        const result = TaskResult.parse(resultPayload);
        const record = this.tasks.get(result.taskId);
        if (!record) return false;
        if (TERMINAL_STATUSES.has(record.status)) return false;

        record.result = result;
        record.updatedAt = result.completedAt;
        record.closedAt = result.completedAt;

        if (result.status === 'success') {
            record.status = 'completed';
        } else if (result.status === 'partial') {
            record.status = 'partial';
        } else {
            record.status = 'failed';
        }

        this._setRetryLifecycleState(record, 'terminalized', result.completedAt, {
            reason: result.status,
            terminalReason: result.status,
            nextRetryAt: null,
            forceHistory: true
        });

        record.history.push({
            at: result.completedAt,
            event: 'result',
            resultStatus: result.status
        });
        this._persistRecord(record);
        this._emitAudit('task_result', {
            taskId: record.taskId,
            from: result.from,
            status: result.status
        }, result.completedAt);

        return true;
    }

    _isRetryBudgetExhausted(record) {
        this._normalizeRetryLifecycle(record);
        const attempts = safeNonNegativeInteger(record?.attempts, 0);
        const maxRetries = safeNonNegativeInteger(record?.maxRetries, this.maxRetries);
        return attempts > maxRetries;
    }

    _computeRetryDelayMs(record, reason = 'timeout') {
        const lifecycle = this._normalizeRetryLifecycle(record);
        const baseDelayMs = safeNonNegativeNumber(this.retryDelayMs, 0);
        if (baseDelayMs === 0) return 0;

        const maxDelayMs = safeNonNegativeNumber(this.maxRetryDelayMs, baseDelayMs);
        const exponent = Math.min(safeNonNegativeInteger(lifecycle?.scheduledCount, 0), 30);
        const exponentialDelayMs = baseDelayMs * (2 ** exponent);

        const consecutiveFailures = safeNonNegativeInteger(lifecycle?.consecutiveFailures, 0);
        const failureMultiplier = 1 + Math.min(consecutiveFailures, 4) * 0.15;
        const reasonMultiplier = reason === 'transport_failure' || reason === 'approval_release_failed'
            ? 1.25
            : 1;

        const uncappedDelayMs = exponentialDelayMs * failureMultiplier * reasonMultiplier;
        const cappedDelayMs = Math.min(maxDelayMs, uncappedDelayMs);

        if (cappedDelayMs === 0 || this.retryJitterRatio <= 0) {
            return Math.round(cappedDelayMs);
        }

        const minFactor = Math.max(0, 1 - this.retryJitterRatio);
        const maxFactor = 1 + this.retryJitterRatio;
        const unit = stableUnitInterval(
            `${record?.taskId}:${reason}:${lifecycle?.scheduledCount}:${consecutiveFailures}:${record?.attempts}:${record?.updatedAt ?? 0}`
        );
        const jitterFactor = minFactor + (maxFactor - minFactor) * unit;
        const jitteredDelayMs = cappedDelayMs * jitterFactor;

        return Math.min(maxDelayMs, Math.max(0, Math.round(jitteredDelayMs)));
    }

    _scheduleRetry(record, nowMs, reason = 'timeout') {
        const lifecycle = this._normalizeRetryLifecycle(record);

        if (this._isRetryBudgetExhausted(record)) {
            const terminalReason = `retry_budget_exhausted:${reason}`;
            const status = reason === 'transport_failure' || reason === 'approval_release_failed'
                ? 'transport_error'
                : 'timed_out';

            this._terminalizeRecordForRetry(record, {
                nowMs,
                status,
                event: status === 'transport_error' ? 'transport_error' : 'timed_out',
                reason: terminalReason,
                auditEvent: status === 'transport_error' ? 'task_transport_error' : 'task_timed_out',
                auditPayload: {
                    error: record.lastError,
                    retryGuard: 'retry_budget_exhausted'
                }
            });
            return null;
        }

        if (this._isRetryCycleExhausted(record)) {
            const terminalReason = `retry_cycle_guard:${reason}`;
            const status = reason === 'transport_failure' || reason === 'approval_release_failed'
                ? 'transport_error'
                : 'timed_out';

            this._terminalizeRecordForRetry(record, {
                nowMs,
                status,
                event: status === 'transport_error' ? 'transport_error' : 'timed_out',
                reason: terminalReason,
                auditEvent: status === 'transport_error' ? 'task_transport_error' : 'task_timed_out',
                auditPayload: {
                    error: record.lastError,
                    retryGuard: 'retry_cycle_guard'
                }
            });
            return null;
        }

        const delayMs = this._computeRetryDelayMs(record, reason);
        const nextRetryAt = nowMs + delayMs;

        lifecycle.scheduledCount += 1;
        lifecycle.lastReason = reason;
        lifecycle.lastDelayMs = delayMs;
        lifecycle.nextRetryAt = nextRetryAt;

        record.status = 'retry_scheduled';
        record.nextRetryAt = nextRetryAt;
        record.updatedAt = nowMs;
        this._setRetryLifecycleState(record, 'scheduled', nowMs, {
            reason,
            delayMs,
            nextRetryAt,
            forceHistory: true
        });
        record.history.push({
            at: nowMs,
            event: 'retry_scheduled',
            reason,
            delayMs,
            nextRetryAt,
            retryCount: lifecycle.scheduledCount
        });
        this._persistRecord(record);
        this._emitAudit('task_retry_scheduled', {
            taskId: record.taskId,
            target: record.target,
            reason,
            delayMs,
            nextRetryAt,
            retryCount: lifecycle.scheduledCount
        }, nowMs);

        return nextRetryAt;
    }

    async runMaintenance(nowMs = safeNow(this.now)) {
        const summary = {
            checked: 0,
            scheduledRetries: 0,
            retried: 0,
            timedOut: 0,
            transportFailures: 0
        };

        for (const record of this.tasks.values()) {
            if (!OPEN_STATUSES.has(record.status)) continue;
            this._normalizeRetryLifecycle(record);
            summary.checked++;

            const deadlineAt = Number.isFinite(record.deadlineAt) ? Number(record.deadlineAt) : 0;
            if (nowMs <= deadlineAt) continue;

            if (this._isRetryBudgetExhausted(record)) {
                this._terminalizeRecordForRetry(record, {
                    nowMs,
                    status: 'timed_out',
                    event: 'timed_out',
                    reason: 'retry_budget_exhausted:timeout',
                    auditEvent: 'task_timed_out',
                    auditPayload: {
                        retryGuard: 'retry_budget_exhausted'
                    }
                });
                summary.timedOut++;
                continue;
            }

            if (this._isRetryCycleExhausted(record)) {
                this._terminalizeRecordForRetry(record, {
                    nowMs,
                    status: 'timed_out',
                    event: 'timed_out',
                    reason: 'retry_cycle_guard:timeout',
                    auditEvent: 'task_timed_out',
                    auditPayload: {
                        retryGuard: 'retry_cycle_guard'
                    }
                });
                summary.timedOut++;
                continue;
            }

            if (record.nextRetryAt === null) {
                const scheduledAt = this._scheduleRetry(record, nowMs, 'timeout');
                if (scheduledAt !== null) {
                    summary.scheduledRetries++;
                } else if (record.status === 'timed_out') {
                    summary.timedOut++;
                } else if (record.status === 'transport_error') {
                    summary.transportFailures++;
                }
                continue;
            }

            if (nowMs < record.nextRetryAt) continue;

            try {
                await this._sendTask(record, 'timeout_retry');
                summary.retried++;
            } catch (error) {
                summary.transportFailures++;
                this.logger.warn?.(
                    `[Swarm] Retry send failed for task ${record.taskId}: ${error.message}`
                );

                const scheduledAt = this._scheduleRetry(record, nowMs, 'transport_failure');
                if (scheduledAt !== null) {
                    summary.scheduledRetries++;
                } else if (record.status === 'timed_out') {
                    summary.timedOut++;
                }
            }
        }

        return summary;
    }

    getTask(taskId) {
        const record = this.tasks.get(taskId);
        if (!record) return null;
        return clone(record);
    }

    listTasks({ status = null, openOnly = false, target = null } = {}) {
        const output = [];
        for (const record of this.tasks.values()) {
            if (status && record.status !== status) continue;
            if (target && record.target !== target) continue;
            if (openOnly && TERMINAL_STATUSES.has(record.status)) continue;
            output.push(clone(record));
        }
        return output;
    }

    listPendingApprovals() {
        return this.listTasks({ status: APPROVAL_PENDING_STATUS });
    }

    getMetrics() {
        const metrics = {
            total: this.tasks.size,
            open: 0,
            terminal: 0,
            byStatus: {},
            avgAttempts: 0
        };

        let attemptsTotal = 0;
        for (const record of this.tasks.values()) {
            attemptsTotal += safeNonNegativeNumber(record.attempts, 0);
            metrics.byStatus[record.status] = (metrics.byStatus[record.status] || 0) + 1;

            if (TERMINAL_STATUSES.has(record.status)) {
                metrics.terminal++;
            } else {
                metrics.open++;
            }
        }

        metrics.avgAttempts = this.tasks.size > 0
            ? Number((attemptsTotal / this.tasks.size).toFixed(2))
            : 0;

        return metrics;
    }
}
