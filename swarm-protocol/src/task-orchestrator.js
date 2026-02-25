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

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function safeNow(nowFn) {
    const value = Number(nowFn());
    return Number.isFinite(value) ? value : Date.now();
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
        defaultTimeoutMs = 30_000,
        maxRetries = 1,
        retryDelayMs = 500,
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
        this.defaultTimeoutMs = Number.isFinite(defaultTimeoutMs) && defaultTimeoutMs > 0
            ? Number(defaultTimeoutMs)
            : 30_000;
        this.maxRetries = Number.isInteger(maxRetries) && maxRetries >= 0
            ? maxRetries
            : 1;
        this.retryDelayMs = Number.isFinite(retryDelayMs) && retryDelayMs >= 0
            ? Number(retryDelayMs)
            : 500;
        this.now = typeof now === 'function' ? now : Date.now;
        this.logger = logger;
        this.tasks = new Map();
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

        const request = buildTaskRequest({
            from: this.localAgentId,
            target: resolvedTarget,
            task,
            priority,
            context,
            constraints,
            id,
            createdAt
        });

        const record = {
            taskId: request.id,
            target: request.target,
            request,
            status: 'created',
            attempts: 0,
            maxRetries: this.maxRetries,
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

        this.tasks.set(record.taskId, record);

        try {
            await this._sendTask(record, 'initial_dispatch');
        } catch (error) {
            this.tasks.delete(record.taskId);
            throw error;
        }

        return this.getTask(record.taskId);
    }

    async _sendTask(record, reason) {
        const sendAt = safeNow(this.now);
        record.attempts += 1;
        record.updatedAt = sendAt;
        record.history.push({
            at: sendAt,
            event: 'send_attempt',
            reason,
            attempt: record.attempts
        });

        try {
            await this.transport.send(record.target, record.request);
            record.status = 'dispatched';
            record.deadlineAt = sendAt + this.defaultTimeoutMs;
            record.nextRetryAt = null;
            record.lastError = null;
            record.history.push({
                at: safeNow(this.now),
                event: 'send_success',
                attempt: record.attempts
            });
        } catch (error) {
            const message = error?.message || 'Failed to dispatch task';
            record.lastError = message;
            record.updatedAt = safeNow(this.now);
            record.history.push({
                at: record.updatedAt,
                event: 'send_failed',
                attempt: record.attempts,
                error: message
            });
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
            record.history.push({
                at: receipt.timestamp,
                event: 'rejected',
                reason: receipt.reason || 'rejected_by_worker'
            });
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

        record.history.push({
            at: result.completedAt,
            event: 'result',
            resultStatus: result.status
        });

        return true;
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
            summary.checked++;

            if (nowMs <= record.deadlineAt) continue;

            if (record.attempts > record.maxRetries) {
                record.status = 'timed_out';
                record.updatedAt = nowMs;
                record.closedAt = nowMs;
                record.history.push({ at: nowMs, event: 'timed_out' });
                summary.timedOut++;
                continue;
            }

            if (record.nextRetryAt === null) {
                record.status = 'retry_scheduled';
                record.nextRetryAt = nowMs + this.retryDelayMs;
                record.updatedAt = nowMs;
                record.history.push({
                    at: nowMs,
                    event: 'retry_scheduled',
                    nextRetryAt: record.nextRetryAt
                });
                summary.scheduledRetries++;
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

                if (record.attempts > record.maxRetries) {
                    record.status = 'transport_error';
                    record.updatedAt = nowMs;
                    record.closedAt = nowMs;
                    record.history.push({
                        at: nowMs,
                        event: 'transport_error',
                        error: record.lastError
                    });
                } else {
                    record.status = 'retry_scheduled';
                    record.nextRetryAt = nowMs + this.retryDelayMs;
                    record.updatedAt = nowMs;
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
            attemptsTotal += record.attempts;
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
