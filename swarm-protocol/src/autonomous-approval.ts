import { buildTaskRequest } from './task-orchestrator.js';
import { TaskRequest } from './schemas.js';

const BypassModes = new Set(['disabled', 'policy_assisted', 'bypass_all']);

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function safeNow(nowFn) {
    const value = Number(nowFn());
    return Number.isFinite(value) ? value : Date.now();
}

function normalizeStringList(value, { lower = false } = {}) {
    if (!Array.isArray(value)) return [];
    return [...new Set(value
        .filter((item) => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => (lower ? item.toLowerCase() : item))
    )];
}

function normalizeMode(mode) {
    const normalized = typeof mode === 'string' ? mode.trim().toLowerCase() : '';
    return BypassModes.has(normalized) ? normalized : 'bypass_all';
}

function normalizePriority(priority) {
    const value = typeof priority === 'string' ? priority.trim().toLowerCase() : '';
    if (['low', 'normal', 'high', 'critical'].includes(value)) {
        return value;
    }
    return 'normal';
}

function normalizeBaselineDecision(decision) {
    if (!decision || typeof decision !== 'object') {
        return {
            required: false,
            reviewerGroup: null,
            reason: null,
            matchedRules: []
        };
    }

    return {
        required: decision.required === true,
        reviewerGroup: typeof decision.reviewerGroup === 'string'
            ? decision.reviewerGroup
            : null,
        reason: typeof decision.reason === 'string'
            ? decision.reason
            : null,
        matchedRules: normalizeStringList(decision.matchedRules || [])
    };
}

function extractSignals(taskRequest) {
    const context = taskRequest?.context || {};
    return {
        priority: normalizePriority(taskRequest?.priority),
        riskTags: normalizeStringList(context.riskTags, { lower: true }),
        requiredCapabilities: normalizeStringList(context.requiredCapabilities, { lower: true }),
        task: typeof taskRequest?.task === 'string' ? taskRequest.task : ''
    };
}

function hardBlockReason(signals, blockedRiskTags, blockedCapabilities) {
    const riskMatch = signals.riskTags.find((tag) => blockedRiskTags.includes(tag));
    if (riskMatch) {
        return `hard_block:risk_tag:${riskMatch}`;
    }

    const capabilityMatch = signals.requiredCapabilities.find((capability) => blockedCapabilities.includes(capability));
    if (capabilityMatch) {
        return `hard_block:capability:${capabilityMatch}`;
    }

    return null;
}

function baseDecisionOrDefault(taskRequest, baseApprovalPolicy) {
    if (typeof baseApprovalPolicy !== 'function') {
        return {
            decision: {
                required: false,
                reviewerGroup: null,
                reason: null,
                matchedRules: []
            },
            error: null
        };
    }

    try {
        const raw = baseApprovalPolicy(taskRequest);
        return {
            decision: normalizeBaselineDecision(raw),
            error: null
        };
    } catch (error) {
        return {
            decision: {
                required: true,
                reviewerGroup: 'human-review',
                reason: 'baseline_policy_error',
                matchedRules: ['baseline_policy_error']
            },
            error: error instanceof Error ? error.message : String(error)
        };
    }
}

function computeOutcome({
    mode,
    baselineDecision,
    hardBlock,
    autoReviewerGroup
}) {
    if (hardBlock) {
        return {
            outcome: 'denied',
            decision: {
                required: true,
                reviewerGroup: 'ops-block',
                reason: hardBlock,
                matchedRules: [hardBlock],
                autoApproved: false,
                bypassedHumanReview: false
            }
        };
    }

    if (mode === 'disabled') {
        return {
            outcome: baselineDecision.required ? 'requires_human' : 'approved',
            decision: {
                required: baselineDecision.required,
                reviewerGroup: baselineDecision.reviewerGroup,
                reason: baselineDecision.reason,
                matchedRules: baselineDecision.matchedRules,
                autoApproved: false,
                bypassedHumanReview: false
            }
        };
    }

    if (mode === 'policy_assisted') {
        if (baselineDecision.required) {
            return {
                outcome: 'auto_approved',
                decision: {
                    required: false,
                    reviewerGroup: autoReviewerGroup,
                    reason: `policy_assisted_bypass:${baselineDecision.reason || 'approval_required'}`,
                    matchedRules: baselineDecision.matchedRules,
                    autoApproved: true,
                    bypassedHumanReview: true
                }
            };
        }

        return {
            outcome: 'approved',
            decision: {
                required: false,
                reviewerGroup: null,
                reason: baselineDecision.reason || 'no_human_review_required',
                matchedRules: baselineDecision.matchedRules,
                autoApproved: false,
                bypassedHumanReview: false
            }
        };
    }

    return {
        outcome: 'auto_approved',
        decision: {
            required: false,
            reviewerGroup: autoReviewerGroup,
            reason: `bypass_all:${baselineDecision.reason || 'autonomous_continuation'}`,
            matchedRules: baselineDecision.matchedRules,
            autoApproved: true,
            bypassedHumanReview: true
        }
    };
}

export function evaluateAutonomousApproval(taskRequestPayload, {
    mode = 'bypass_all',
    baseApprovalPolicy = null,
    blockedRiskTags = [],
    blockedCapabilities = [],
    autoReviewer = 'agent:auto-approval',
    autoReviewerGroup = 'auto-approval',
    now = Date.now
} = {}) {
    const taskRequest = TaskRequest.parse(taskRequestPayload);
    const normalizedMode = normalizeMode(mode);
    const at = safeNow(now);
    const signals = extractSignals(taskRequest);
    const blockedTags = normalizeStringList(blockedRiskTags, { lower: true });
    const blockedCaps = normalizeStringList(blockedCapabilities, { lower: true });
    const hardBlock = hardBlockReason(signals, blockedTags, blockedCaps);
    const baselineResult = baseDecisionOrDefault(taskRequest, baseApprovalPolicy);
    const resolution = computeOutcome({
        mode: normalizedMode,
        baselineDecision: baselineResult.decision,
        hardBlock,
        autoReviewerGroup
    });

    const reviewStatus = resolution.outcome === 'denied'
        ? 'denied'
        : (resolution.decision.autoApproved ? 'approved' : (resolution.decision.required ? 'pending' : 'approved'));
    const reviewedAt = reviewStatus === 'pending' ? null : at;

    return {
        at,
        taskId: taskRequest.id,
        mode: normalizedMode,
        outcome: resolution.outcome,
        baselineDecision: clone(baselineResult.decision),
        baselinePolicyError: baselineResult.error,
        decision: clone(resolution.decision),
        evidence: {
            priority: signals.priority,
            riskTags: [...signals.riskTags],
            requiredCapabilities: [...signals.requiredCapabilities]
        },
        approvalPatch: {
            status: reviewStatus,
            reviewer: resolution.decision.autoApproved ? autoReviewer : null,
            reviewerGroup: resolution.decision.reviewerGroup,
            reason: resolution.decision.reason,
            matchedRules: resolution.decision.matchedRules,
            requestedAt: taskRequest.createdAt,
            reviewedAt,
            autoApproved: resolution.decision.autoApproved,
            bypassMode: normalizedMode,
            bypassedHumanReview: resolution.decision.bypassedHumanReview
        }
    };
}

export function buildAutonomousApprovalAuditEntry(evaluationPayload, {
    actor = 'agent:auto-approval'
} = {}) {
    if (!evaluationPayload || typeof evaluationPayload !== 'object') {
        throw new Error('buildAutonomousApprovalAuditEntry requires evaluation payload');
    }

    return {
        eventType: 'autonomous_approval_decision',
        at: Number(evaluationPayload.at) || Date.now(),
        actor,
        payload: {
            taskId: evaluationPayload.taskId || null,
            mode: evaluationPayload.mode || 'bypass_all',
            outcome: evaluationPayload.outcome || 'unknown',
            baselineRequired: evaluationPayload?.baselineDecision?.required === true,
            decisionRequired: evaluationPayload?.decision?.required === true,
            autoApproved: evaluationPayload?.decision?.autoApproved === true,
            reason: evaluationPayload?.decision?.reason || null,
            evidence: clone(evaluationPayload.evidence || {})
        }
    };
}

export function createAutonomousApprovalPolicy({
    mode = 'bypass_all',
    baseApprovalPolicy = null,
    blockedRiskTags = [],
    blockedCapabilities = [],
    autoReviewer = 'agent:auto-approval',
    autoReviewerGroup = 'auto-approval',
    now = Date.now
} = {}) {
    return (taskRequestPayload) => {
        const evaluation = evaluateAutonomousApproval(taskRequestPayload, {
            mode,
            baseApprovalPolicy,
            blockedRiskTags,
            blockedCapabilities,
            autoReviewer,
            autoReviewerGroup,
            now
        });

        return {
            required: evaluation.decision.required === true,
            reviewerGroup: evaluation.decision.reviewerGroup || null,
            reason: evaluation.decision.reason || null,
            matchedRules: evaluation.decision.matchedRules || [],
            autoApproved: evaluation.decision.autoApproved === true,
            bypassMode: evaluation.mode,
            bypassedHumanReview: evaluation.decision.bypassedHumanReview === true
        };
    };
}

export function autoApproveQueue(taskRecords, options = {}) {
    const rows = Array.isArray(taskRecords) ? taskRecords : [];
    const evaluations = [];
    let scanned = 0;
    let autoApproved = 0;
    let denied = 0;
    let pending = 0;

    for (const row of rows) {
        if (!row || typeof row !== 'object') continue;
        if (row.status !== 'awaiting_approval') continue;
        scanned++;

        const requestPayload = row.request || {};
        let taskRequest = requestPayload;
        if (!requestPayload.kind) {
            taskRequest = buildTaskRequest({
                id: requestPayload.id || row.taskId,
                from: requestPayload.from || 'agent:auto-approval',
                target: requestPayload.target || row.target,
                priority: requestPayload.priority || 'normal',
                task: requestPayload.task || 'approval queue task',
                context: requestPayload.context || {},
                constraints: requestPayload.constraints || [],
                createdAt: requestPayload.createdAt || row.createdAt || Date.now()
            });
        }

        const evaluation = evaluateAutonomousApproval(taskRequest, options);
        evaluations.push(evaluation);

        if (evaluation.outcome === 'auto_approved') autoApproved++;
        else if (evaluation.outcome === 'denied') denied++;
        else if (evaluation.outcome === 'requires_human') pending++;
    }

    return {
        generatedAt: new Date(safeNow(Date.now)).toISOString(),
        scanned,
        autoApproved,
        denied,
        pending,
        evaluations
    };
}

export function buildAutoApprovalFollowupTasks(summaryPayload, {
    fromAgentId = 'agent:auto-approval',
    defaultTarget = 'agent:ops'
} = {}) {
    if (!summaryPayload || typeof summaryPayload !== 'object') {
        throw new Error('buildAutoApprovalFollowupTasks requires summary payload');
    }

    const evaluations = Array.isArray(summaryPayload.evaluations)
        ? summaryPayload.evaluations
        : [];
    const nowMs = safeNow(Date.now);

    return evaluations
        .filter((evaluation) => evaluation.outcome === 'denied' || evaluation.outcome === 'requires_human')
        .map((evaluation, index) => buildTaskRequest({
            id: evaluation.taskId,
            from: fromAgentId,
            target: defaultTarget,
            priority: evaluation.outcome === 'denied' ? 'high' : 'normal',
            task: evaluation.outcome === 'denied'
                ? `Resolve blocked autonomous approval for ${evaluation.taskId}`
                : `Handle remaining human approval for ${evaluation.taskId}`,
            context: {
                approvalOutcome: evaluation.outcome,
                bypassMode: evaluation.mode,
                reason: evaluation?.decision?.reason || null
            },
            createdAt: nowMs + index
        }));
}

export class AutonomousApprovalEngine {
    constructor({
        localAgentId = 'agent:auto-approval',
        now = Date.now,
        maxHistory = 300
    } = {}) {
        this.localAgentId = localAgentId;
        this.now = typeof now === 'function' ? now : Date.now;
        this.maxHistory = Number.isInteger(maxHistory) && maxHistory > 0
            ? maxHistory
            : 300;
        this.history = [];
    }

    evaluateTask(taskRequestPayload, options = {}) {
        const evaluation = evaluateAutonomousApproval(taskRequestPayload, {
            now: this.now,
            ...options
        });
        this.history.push(evaluation);
        if (this.history.length > this.maxHistory) {
            this.history.splice(0, this.history.length - this.maxHistory);
        }
        return clone(evaluation);
    }

    autoApproveQueue(taskRecords, options = {}) {
        const summary = autoApproveQueue(taskRecords, {
            now: this.now,
            ...options
        });

        const evaluations = Array.isArray(summary.evaluations) ? summary.evaluations : [];
        this.history.push(...evaluations);
        if (this.history.length > this.maxHistory) {
            this.history.splice(0, this.history.length - this.maxHistory);
        }

        return clone(summary);
    }

    buildFollowupTasks(summaryPayload, options = {}) {
        return buildAutoApprovalFollowupTasks(summaryPayload, {
            fromAgentId: this.localAgentId,
            ...options
        });
    }

    listHistory({ limit = 50 } = {}) {
        return this.history
            .slice(-Math.max(1, Number(limit) || 50))
            .map((entry) => clone(entry));
    }
}

export const __autonomousApprovalInternals = {
    normalizeMode,
    normalizeBaselineDecision,
    extractSignals,
    hardBlockReason,
    computeOutcome
};
