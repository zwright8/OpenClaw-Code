import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    fill_decision_rationale: 'agent:ops',
    run_policy_audit: 'agent:review',
    capture_evidence_links: 'agent:analysis',
    coach_operator_consistency: 'agent:ops-lead',
    publish_decision_replay_report: 'agent:ops'
};

const RecommendationPriorityTaskMap = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
};

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function safeNow(nowFn) {
    const value = Number(nowFn());
    return Number.isFinite(value) ? value : Date.now();
}

function safeNumber(value, fallback = 0) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
}

function clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, value));
}

function normalizeDecisions(inputPayload) {
    const decisions = Array.isArray(inputPayload?.decisions)
        ? inputPayload.decisions
        : [];

    return decisions
        .filter((decision) => decision && typeof decision === 'object')
        .map((decision, index) => {
            const decisionId = typeof decision.decisionId === 'string' && decision.decisionId.trim()
                ? decision.decisionId.trim()
                : `decision-${index + 1}`;
            const taskId = typeof decision.taskId === 'string' && decision.taskId.trim()
                ? decision.taskId.trim()
                : `task-${index + 1}`;
            const operatorId = typeof decision.operatorId === 'string' && decision.operatorId.trim()
                ? decision.operatorId.trim()
                : 'human:unknown';
            const action = typeof decision.action === 'string' && decision.action.trim()
                ? decision.action.trim()
                : 'unknown_action';
            const at = safeNumber(decision.at, index + 1);
            const rationale = typeof decision.rationale === 'string'
                ? decision.rationale.trim()
                : '';
            const policyRefs = Array.isArray(decision.policyRefs)
                ? decision.policyRefs.filter((entry) => typeof entry === 'string' && entry.trim()).map((entry) => entry.trim())
                : [];
            const evidenceRefs = Array.isArray(decision.evidenceRefs)
                ? decision.evidenceRefs.filter((entry) => typeof entry === 'string' && entry.trim()).map((entry) => entry.trim())
                : [];
            const outcome = typeof decision.outcome === 'string' && decision.outcome.trim()
                ? decision.outcome.trim()
                : 'unknown';
            const confidence = clamp(safeNumber(decision.confidence, 65));
            const manualOverride = decision.manualOverride === true
                || action.includes('override')
                || outcome === 'manual_override';

            return {
                decisionId,
                taskId,
                operatorId,
                action,
                at,
                rationale,
                policyRefs,
                evidenceRefs,
                outcome,
                confidence,
                manualOverride
            };
        })
        .sort((a, b) => {
            if (a.at !== b.at) return a.at - b.at;
            return String(a.decisionId).localeCompare(String(b.decisionId));
        });
}

function groupByTask(decisions) {
    const groups = new Map();
    for (const decision of decisions) {
        const existing = groups.get(decision.taskId) || [];
        existing.push(decision);
        groups.set(decision.taskId, existing);
    }
    return groups;
}

function evaluateChain(taskId, decisionsForTask) {
    const steps = [];
    let missingRationaleCount = 0;
    let stepsWithPolicy = 0;
    let stepsWithEvidence = 0;
    let overrideCount = 0;
    let operatorSwitches = 0;

    for (let index = 0; index < decisionsForTask.length; index++) {
        const decision = decisionsForTask[index];
        const prev = index > 0 ? decisionsForTask[index - 1] : null;
        const latencyFromPreviousMs = prev ? Math.max(0, decision.at - prev.at) : 0;
        if (index > 0 && prev.operatorId !== decision.operatorId) operatorSwitches++;
        if (decision.rationale.length < 8) missingRationaleCount++;
        if (decision.policyRefs.length > 0) stepsWithPolicy++;
        if (decision.evidenceRefs.length > 0) stepsWithEvidence++;
        if (decision.manualOverride) overrideCount++;

        steps.push({
            step: index + 1,
            decisionId: decision.decisionId,
            operatorId: decision.operatorId,
            action: decision.action,
            at: decision.at,
            latencyFromPreviousMs,
            rationalePresent: decision.rationale.length >= 8,
            policyRefCount: decision.policyRefs.length,
            evidenceRefCount: decision.evidenceRefs.length,
            outcome: decision.outcome,
            confidence: decision.confidence,
            manualOverride: decision.manualOverride
        });
    }

    const firstAt = steps.length > 0 ? steps[0].at : 0;
    const lastAt = steps.length > 0 ? steps[steps.length - 1].at : 0;
    const chainDurationMs = Math.max(0, lastAt - firstAt);
    const stepCount = steps.length;
    const rationaleCoverage = stepCount > 0
        ? Number((((stepCount - missingRationaleCount) / stepCount) * 100).toFixed(2))
        : 0;
    const policyCoverage = stepCount > 0
        ? Number(((stepsWithPolicy / stepCount) * 100).toFixed(2))
        : 0;
    const evidenceCoverage = stepCount > 0
        ? Number(((stepsWithEvidence / stepCount) * 100).toFixed(2))
        : 0;
    const avgConfidence = stepCount > 0
        ? Number((steps.reduce((acc, step) => acc + step.confidence, 0) / stepCount).toFixed(2))
        : 0;

    const latencyPenalty = clamp(chainDurationMs / (60 * 60 * 2_000), 0, 30);
    const consistencyScore = clamp(Math.round(
        rationaleCoverage * 0.35
        + policyCoverage * 0.25
        + evidenceCoverage * 0.15
        + avgConfidence * 0.2
        - overrideCount * 6
        - operatorSwitches * 4
        - latencyPenalty
    ));
    const auditabilityScore = clamp(Math.round(
        rationaleCoverage * 0.4
        + policyCoverage * 0.25
        + evidenceCoverage * 0.15
        + (100 - latencyPenalty) * 0.1
        + avgConfidence * 0.1
    ));

    let posture = 'auditable';
    if (
        missingRationaleCount >= 2
        || policyCoverage < 35
        || auditabilityScore < 50
    ) {
        posture = 'blocked';
    } else if (
        missingRationaleCount > 0
        || evidenceCoverage < 50
        || auditabilityScore < 70
        || overrideCount > 0
    ) {
        posture = 'review_required';
    }

    return {
        taskId,
        stepCount,
        chainDurationMs,
        rationaleCoverage,
        policyCoverage,
        evidenceCoverage,
        avgConfidence,
        consistencyScore,
        auditabilityScore,
        missingRationaleCount,
        overrideCount,
        operatorSwitches,
        posture,
        latestOutcome: stepCount > 0 ? steps[stepCount - 1].outcome : 'unknown',
        steps
    };
}

function summarizeChains(chains) {
    const decisionCount = chains.reduce((acc, chain) => acc + chain.stepCount, 0);
    const avgAuditabilityScore = chains.length > 0
        ? Number((chains.reduce((acc, chain) => acc + chain.auditabilityScore, 0) / chains.length).toFixed(2))
        : 0;
    const avgDurationMinutes = chains.length > 0
        ? Number((chains.reduce((acc, chain) => acc + chain.chainDurationMs, 0) / chains.length / 60_000).toFixed(2))
        : 0;
    const missingRationaleDecisions = chains.reduce((acc, chain) => acc + chain.missingRationaleCount, 0);
    const overrideCount = chains.reduce((acc, chain) => acc + chain.overrideCount, 0);

    let posture = 'healthy';
    const blockedCount = chains.filter((chain) => chain.posture === 'blocked').length;
    const reviewRequiredCount = chains.filter((chain) => chain.posture === 'review_required').length;
    if (blockedCount > 0) posture = 'at_risk';
    else if (reviewRequiredCount > 0 || avgAuditabilityScore < 75) posture = 'review_required';

    return {
        chainCount: chains.length,
        decisionCount,
        auditableCount: chains.filter((chain) => chain.posture === 'auditable').length,
        reviewRequiredCount,
        blockedCount,
        avgAuditabilityScore,
        avgDurationMinutes,
        missingRationaleDecisions,
        overrideCount,
        posture
    };
}

function buildAlerts(summary, chains) {
    const alerts = [];
    if (summary.blockedCount > 0) alerts.push('decision_chain_not_auditable');
    if (summary.missingRationaleDecisions > 0) alerts.push('missing_decision_rationale');
    if (summary.overrideCount >= 3) alerts.push('manual_override_frequency_high');
    if (summary.avgDurationMinutes > 180) alerts.push('decision_latency_high');
    if (chains.some((chain) => chain.evidenceCoverage < 50)) alerts.push('decision_evidence_gap');
    return alerts;
}

function buildRecommendations(chains, summary, alerts) {
    const recommendations = [];

    for (const chain of chains) {
        if (chain.missingRationaleCount > 0) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'fill_decision_rationale',
                taskId: chain.taskId,
                title: `Fill missing rationale on task ${chain.taskId}`,
                description: `${chain.missingRationaleCount} decision step(s) missing clear rationale.`,
                priority: chain.posture === 'blocked' ? 'P0' : 'P1'
            });
        }

        if (chain.policyCoverage < 60) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'run_policy_audit',
                taskId: chain.taskId,
                title: `Run policy audit on decision chain ${chain.taskId}`,
                description: `Policy reference coverage is ${chain.policyCoverage}%.`,
                priority: chain.posture === 'blocked' ? 'P0' : 'P1'
            });
        }

        if (chain.evidenceCoverage < 50) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'capture_evidence_links',
                taskId: chain.taskId,
                title: `Capture missing evidence links for ${chain.taskId}`,
                description: `Evidence coverage is ${chain.evidenceCoverage}%.`,
                priority: 'P1'
            });
        }
    }

    if (alerts.includes('manual_override_frequency_high') || summary.avgAuditabilityScore < 70) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'coach_operator_consistency',
            title: 'Coach operator decision consistency',
            description: 'High override frequency or low auditability indicates consistency gaps.',
            priority: 'P1'
        });
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_decision_replay_report',
            title: 'Publish operator decision replay report',
            description: 'Share replay findings, audit posture, and remediation ownership.',
            priority: alerts.includes('decision_chain_not_auditable') ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.taskId || '').localeCompare(String(b.taskId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.taskId || '') === String(entry.taskId || '')
        )) === index);
}

export function buildOperatorDecisionReplay(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const decisions = normalizeDecisions(inputPayload || {});
    const groups = groupByTask(decisions);
    const chains = [...groups.entries()].map(([taskId, entries]) => evaluateChain(taskId, entries))
        .sort((a, b) => {
            const postureRank = { blocked: 0, review_required: 1, auditable: 2 };
            const p = postureRank[a.posture] - postureRank[b.posture];
            if (p !== 0) return p;
            return b.auditabilityScore - a.auditabilityScore;
        });
    const summary = summarizeChains(chains);
    const alerts = buildAlerts(summary, chains);
    const recommendations = buildRecommendations(chains, summary, alerts);

    return {
        at,
        summary,
        chains,
        alerts,
        recommendations
    };
}

export function decisionReplayToTasks(reportPayload, {
    fromAgentId = 'agent:decision-replay',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('decisionReplayToTasks requires report payload');
    }

    const recommendations = Array.isArray(reportPayload.recommendations)
        ? reportPayload.recommendations
        : [];
    const targets = {
        ...RecommendationTargetMap,
        ...(targetMap || {})
    };
    const nowMs = safeNow(Date.now);

    return recommendations.map((recommendation, index) => buildTaskRequest({
        id: randomUUID(),
        from: fromAgentId,
        target: targets[recommendation.type] || defaultTarget,
        priority: RecommendationPriorityTaskMap[recommendation.priority] || 'normal',
        task: `[${recommendation.priority}] ${recommendation.title}`,
        context: {
            recommendationType: recommendation.type,
            taskId: recommendation.taskId || null,
            posture: reportPayload.summary?.posture || null,
            avgAuditabilityScore: reportPayload.summary?.avgAuditabilityScore ?? null
        },
        createdAt: nowMs + index
    }));
}

export class OperatorDecisionReplayStudio {
    constructor({
        localAgentId = 'agent:decision-replay',
        now = Date.now,
        maxHistory = 120
    } = {}) {
        this.localAgentId = localAgentId;
        this.now = typeof now === 'function' ? now : Date.now;
        this.maxHistory = Number.isInteger(maxHistory) && maxHistory > 0
            ? maxHistory
            : 120;
        this.history = [];
    }

    evaluate(inputPayload, options = {}) {
        const report = buildOperatorDecisionReplay(inputPayload, {
            now: this.now,
            ...options
        });
        this.history.push(report);
        if (this.history.length > this.maxHistory) {
            this.history.splice(0, this.history.length - this.maxHistory);
        }
        return clone(report);
    }

    buildTasks(reportPayload, options = {}) {
        return decisionReplayToTasks(reportPayload, {
            fromAgentId: this.localAgentId,
            ...options
        });
    }

    listHistory({ limit = 20 } = {}) {
        return this.history
            .slice(-Math.max(1, Number(limit) || 20))
            .map((entry) => clone(entry));
    }
}

export const __operatorDecisionReplayInternals = {
    normalizeDecisions,
    groupByTask,
    evaluateChain,
    summarizeChains,
    buildRecommendations
};
