import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    enforce_safety_gate: 'agent:clinical-ops',
    request_clinical_review: 'agent:clinical-review',
    add_missing_protocol_check: 'agent:quality',
    publish_safety_protocol_brief: 'agent:ops'
};

const RecommendationPriorityTaskMap = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
};

const RiskRank = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1
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

function normalizeStringArray(value) {
    if (!Array.isArray(value)) return [];
    return value
        .filter((entry) => typeof entry === 'string' && entry.trim())
        .map((entry) => entry.trim());
}

function normalizeWorkflows(inputPayload) {
    const workflows = Array.isArray(inputPayload?.workflows)
        ? inputPayload.workflows
        : [];
    return workflows
        .filter((workflow) => workflow && typeof workflow === 'object')
        .map((workflow, index) => ({
            workflowId: typeof workflow.workflowId === 'string' && workflow.workflowId.trim()
                ? workflow.workflowId.trim()
                : `workflow-${index + 1}`,
            setting: typeof workflow.setting === 'string' && workflow.setting.trim()
                ? workflow.setting.trim()
                : 'general_care',
            riskLevel: typeof workflow.riskLevel === 'string' && RiskRank[workflow.riskLevel.trim()]
                ? workflow.riskLevel.trim()
                : 'medium',
            patientSafetyCriticality: clamp(safeNumber(workflow.patientSafetyCriticality, 60)),
            steps: Array.isArray(workflow.steps)
                ? workflow.steps
                    .filter((step) => step && typeof step === 'object')
                    .map((step, stepIndex) => ({
                        id: typeof step.id === 'string' && step.id.trim()
                            ? step.id.trim()
                            : `step-${stepIndex + 1}`,
                        action: typeof step.action === 'string' && step.action.trim()
                            ? step.action.trim()
                            : `Action ${stepIndex + 1}`,
                        domains: normalizeStringArray(step.domains),
                        requiresHumanSignoff: step.requiresHumanSignoff === true
                    }))
                : []
        }));
}

function normalizeProtocols(inputPayload) {
    const protocols = Array.isArray(inputPayload?.protocols)
        ? inputPayload.protocols
        : [];
    return protocols
        .filter((protocol) => protocol && typeof protocol === 'object')
        .map((protocol, index) => ({
            protocolId: typeof protocol.protocolId === 'string' && protocol.protocolId.trim()
                ? protocol.protocolId.trim()
                : `protocol-${index + 1}`,
            name: typeof protocol.name === 'string' && protocol.name.trim()
                ? protocol.name.trim()
                : `Protocol ${index + 1}`,
            mandatory: protocol.mandatory !== false,
            triggerDomains: normalizeStringArray(protocol.triggerDomains),
            settings: normalizeStringArray(protocol.settings),
            requiresSignoff: protocol.requiresSignoff !== false,
            criticality: clamp(safeNumber(protocol.criticality, 65))
        }));
}

function protocolApplies(protocol, workflow, step) {
    const settingMatch = protocol.settings.length === 0
        || protocol.settings.includes('all')
        || protocol.settings.includes(workflow.setting);
    const domainMatch = protocol.triggerDomains.length === 0
        || protocol.triggerDomains.some((domain) => step.domains.includes(domain));
    return settingMatch && domainMatch;
}

function adaptWorkflow(workflow, protocols) {
    const adaptedSteps = [];
    let missingMandatoryChecks = 0;
    let missingSignoffChecks = 0;
    let enforcedSafetyGates = 0;

    for (const step of workflow.steps) {
        const applicable = protocols.filter((protocol) => protocolApplies(protocol, workflow, step));
        const mandatoryChecks = applicable.filter((protocol) => protocol.mandatory);
        const requiredSignoff = step.requiresHumanSignoff || applicable.some((protocol) => protocol.requiresSignoff);
        const hasCriticalProtocol = applicable.some((protocol) => protocol.criticality >= 75);

        let gateStatus = 'pass';
        if (mandatoryChecks.length === 0 && hasCriticalProtocol) {
            gateStatus = 'missing_mandatory';
            missingMandatoryChecks++;
        }
        if (requiredSignoff && !step.requiresHumanSignoff) {
            gateStatus = gateStatus === 'pass' ? 'requires_signoff' : gateStatus;
            missingSignoffChecks++;
        }
        if (gateStatus !== 'pass') enforcedSafetyGates++;

        adaptedSteps.push({
            stepId: step.id,
            action: step.action,
            domains: [...step.domains],
            applicableProtocolIds: applicable.map((protocol) => protocol.protocolId),
            mandatoryProtocolIds: mandatoryChecks.map((protocol) => protocol.protocolId),
            requiredSignoff,
            gateStatus
        });
    }

    const totalSteps = adaptedSteps.length || 1;
    const protocolCoverage = Number((adaptedSteps.reduce((acc, step) => (
        acc + (step.applicableProtocolIds.length > 0 ? 1 : 0)
    ), 0) / totalSteps * 100).toFixed(2));
    const signoffCoverage = Number((adaptedSteps.reduce((acc, step) => (
        acc + (step.requiredSignoff ? 1 : 0)
    ), 0) / totalSteps * 100).toFixed(2));
    const safetyScore = clamp(Math.round(
        protocolCoverage * 0.45
        + (100 - (missingMandatoryChecks / totalSteps * 100)) * 0.3
        + (100 - (missingSignoffChecks / totalSteps * 100)) * 0.15
        + workflow.patientSafetyCriticality * 0.1
    ));

    let posture = 'adapted';
    if (missingMandatoryChecks > 0 || safetyScore < 55) posture = 'blocked';
    else if (missingSignoffChecks > 0 || safetyScore < 75) posture = 'review_required';

    return {
        workflowId: workflow.workflowId,
        setting: workflow.setting,
        riskLevel: workflow.riskLevel,
        patientSafetyCriticality: workflow.patientSafetyCriticality,
        posture,
        safetyScore,
        protocolCoverage,
        signoffCoverage,
        missingMandatoryChecks,
        missingSignoffChecks,
        enforcedSafetyGates,
        adaptedSteps
    };
}

function summarizeAdaptations(adaptations) {
    const avgSafetyScore = adaptations.length > 0
        ? Number((adaptations.reduce((acc, adaptation) => acc + adaptation.safetyScore, 0) / adaptations.length).toFixed(2))
        : 0;
    const missingMandatoryChecks = adaptations.reduce((acc, adaptation) => acc + adaptation.missingMandatoryChecks, 0);
    const missingSignoffChecks = adaptations.reduce((acc, adaptation) => acc + adaptation.missingSignoffChecks, 0);

    let posture = 'safe';
    const blockedCount = adaptations.filter((adaptation) => adaptation.posture === 'blocked').length;
    const reviewRequiredCount = adaptations.filter((adaptation) => adaptation.posture === 'review_required').length;
    if (blockedCount > 0 || missingMandatoryChecks > 0) posture = 'critical';
    else if (reviewRequiredCount > 0 || missingSignoffChecks > 0 || avgSafetyScore < 80) posture = 'review_required';

    return {
        workflowCount: adaptations.length,
        adaptedCount: adaptations.filter((adaptation) => adaptation.posture === 'adapted').length,
        reviewRequiredCount,
        blockedCount,
        missingMandatoryChecks,
        missingSignoffChecks,
        avgSafetyScore,
        posture
    };
}

function buildAlerts(summary, adaptations) {
    const alerts = [];
    if (summary.blockedCount > 0) alerts.push('healthcare_safety_blocked');
    if (summary.missingMandatoryChecks > 0) alerts.push('healthcare_mandatory_check_missing');
    if (summary.missingSignoffChecks > 0) alerts.push('healthcare_signoff_gap');
    if (adaptations.some((adaptation) => adaptation.protocolCoverage < 60)) alerts.push('healthcare_protocol_coverage_low');
    if (summary.avgSafetyScore < 70) alerts.push('healthcare_safety_score_low');
    return alerts;
}

function buildRecommendations(adaptations, summary, alerts) {
    const recommendations = [];
    for (const adaptation of adaptations) {
        if (adaptation.posture === 'blocked') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'enforce_safety_gate',
                workflowId: adaptation.workflowId,
                title: `Enforce safety gates on ${adaptation.workflowId}`,
                description: `Missing mandatory checks: ${adaptation.missingMandatoryChecks}.`,
                priority: 'P0'
            });
        } else if (adaptation.posture === 'review_required') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'request_clinical_review',
                workflowId: adaptation.workflowId,
                title: `Request clinical review for ${adaptation.workflowId}`,
                description: `Safety score ${adaptation.safetyScore} needs human validation.`,
                priority: 'P1'
            });
        }

        if (adaptation.missingMandatoryChecks > 0 || adaptation.protocolCoverage < 70) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'add_missing_protocol_check',
                workflowId: adaptation.workflowId,
                title: `Add missing protocol checks for ${adaptation.workflowId}`,
                description: `Protocol coverage ${adaptation.protocolCoverage}.`,
                priority: adaptation.posture === 'blocked' ? 'P1' : 'P2'
            });
        }
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_safety_protocol_brief',
            title: 'Publish healthcare safety protocol brief',
            description: 'Share adapted workflows, safety gaps, and required approvals.',
            priority: alerts.includes('healthcare_safety_blocked') ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.workflowId || '').localeCompare(String(b.workflowId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.workflowId || '') === String(entry.workflowId || '')
        )) === index);
}

export function adaptHealthcareSafetyProtocols(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const workflows = normalizeWorkflows(inputPayload || {});
    const protocols = normalizeProtocols(inputPayload || {});
    const adaptations = workflows.map((workflow) => adaptWorkflow(workflow, protocols))
        .sort((a, b) => {
            const postureRank = { blocked: 0, review_required: 1, adapted: 2 };
            const p = postureRank[a.posture] - postureRank[b.posture];
            if (p !== 0) return p;
            return a.safetyScore - b.safetyScore;
        });
    const summary = summarizeAdaptations(adaptations);
    const alerts = buildAlerts(summary, adaptations);
    const recommendations = buildRecommendations(adaptations, summary, alerts);

    return {
        at,
        summary,
        adaptations,
        alerts,
        recommendations
    };
}

export function healthcareSafetyToTasks(reportPayload, {
    fromAgentId = 'agent:healthcare-safety',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('healthcareSafetyToTasks requires report payload');
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
            workflowId: recommendation.workflowId || null,
            posture: reportPayload.summary?.posture || null,
            blockedCount: reportPayload.summary?.blockedCount || 0
        },
        createdAt: nowMs + index
    }));
}

export class HealthcareSafetyProtocolAdapter {
    constructor({
        localAgentId = 'agent:healthcare-safety',
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
        const report = adaptHealthcareSafetyProtocols(inputPayload, {
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
        return healthcareSafetyToTasks(reportPayload, {
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

export const __healthcareSafetyAdapterInternals = {
    normalizeWorkflows,
    normalizeProtocols,
    adaptWorkflow,
    summarizeAdaptations,
    buildRecommendations
};
