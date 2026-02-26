import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const PriorityToTaskPriority = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
};

const AlertPriorityWeight = {
    P0: 16,
    P1: 10,
    P2: 6,
    P3: 3
};

const IncidentPriorityWeight = {
    P0: 20,
    P1: 14,
    P2: 8,
    P3: 4
};

const ActionPriority = {
    emergency_freeze: 'P0',
    invoke_recovery_supervisor: 'P1',
    investigate_drift: 'P1',
    provision_capabilities: 'P1',
    drain_queue_pressure: 'P1',
    assign_approval_surge: 'P2',
    heighten_monitoring: 'P2'
};

const ActionTargetMap = {
    emergency_freeze: 'agent:ops',
    invoke_recovery_supervisor: 'agent:recovery',
    investigate_drift: 'agent:routing',
    provision_capabilities: 'agent:skills',
    drain_queue_pressure: 'agent:ops',
    assign_approval_surge: 'agent:ops',
    heighten_monitoring: 'agent:observability'
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

function normalizePriority(priority) {
    const upper = typeof priority === 'string' ? priority.trim().toUpperCase() : '';
    return ['P0', 'P1', 'P2', 'P3'].includes(upper) ? upper : 'P2';
}

function normalizeReadiness(readinessReport) {
    const report = readinessReport && typeof readinessReport === 'object'
        ? readinessReport
        : {};

    return {
        status: typeof report.status === 'string' ? report.status : 'ready',
        score: safeNumber(report.readinessScore, 100),
        missingCapabilityCount: safeNumber(report?.summary?.missingCapabilityCount, 0),
        sandboxGapCount: safeNumber(report?.summary?.sandboxGapCount, 0),
        approvalRequiredCount: safeNumber(report?.summary?.approvalRequiredCount, 0),
        approvalErrorCount: safeNumber(report?.summary?.approvalErrorCount, 0)
    };
}

function normalizeAlerts(driftPayload) {
    const source = Array.isArray(driftPayload)
        ? driftPayload
        : (Array.isArray(driftPayload?.alerts) ? driftPayload.alerts : []);

    return source.map((alert, index) => ({
        id: alert?.id || `alert-${index + 1}`,
        code: alert?.code || 'unknown_alert',
        priority: normalizePriority(alert?.priority),
        target: alert?.target || null
    }));
}

function normalizeIncidents(incidentPayload) {
    const source = Array.isArray(incidentPayload)
        ? incidentPayload
        : (Array.isArray(incidentPayload?.incidents) ? incidentPayload.incidents : []);

    return source.map((incident, index) => ({
        id: incident?.id || `incident-${index + 1}`,
        code: incident?.code || 'unknown_incident',
        priority: normalizePriority(incident?.priority),
        target: incident?.target || null
    }));
}

function normalizeQueue(queueSummary) {
    const source = queueSummary && typeof queueSummary === 'object'
        ? queueSummary
        : {};

    return {
        open: safeNumber(source.open, 0),
        pendingApproval: safeNumber(source.pendingApproval ?? source.awaitingApproval, 0),
        retryScheduled: safeNumber(source.retryScheduled, 0),
        timedOut: safeNumber(source.timedOut, 0)
    };
}

function normalizeHealth(healthSummary) {
    const source = healthSummary && typeof healthSummary === 'object'
        ? healthSummary
        : {};
    const total = safeNumber(source.total, 0);
    const healthy = safeNumber(source.healthy, 0);
    const stale = safeNumber(source.stale, 0);

    return {
        total,
        healthy,
        stale,
        healthyRatio: total > 0 ? healthy / total : 1,
        staleRatio: total > 0 ? stale / total : 0
    };
}

function addReason(reasons, source, code, weight, detail) {
    reasons.push({
        source,
        code,
        weight: safeNumber(weight, 0),
        detail
    });
}

function evaluateRiskContributors({
    readiness,
    alerts,
    incidents,
    queue,
    health,
    thresholds
}) {
    const reasons = [];
    let riskScore = 0;

    if (readiness.status === 'blocked') {
        riskScore += 45;
        addReason(reasons, 'readiness', 'mission_blocked', 45, 'mission readiness status is blocked');
    } else if (readiness.status === 'needs_attention') {
        riskScore += 20;
        addReason(reasons, 'readiness', 'mission_needs_attention', 20, 'mission readiness needs attention');
    }

    if (readiness.score < 85) {
        const delta = Math.ceil((85 - readiness.score) / 5);
        riskScore += delta;
        addReason(reasons, 'readiness', 'low_readiness_score', delta, `readiness score ${readiness.score}`);
    }

    if (readiness.missingCapabilityCount > 0) {
        const weight = Math.min(18, readiness.missingCapabilityCount * 4);
        riskScore += weight;
        addReason(reasons, 'readiness', 'missing_capabilities', weight, `${readiness.missingCapabilityCount} missing capabilities`);
    }

    if (readiness.sandboxGapCount > 0) {
        const weight = Math.min(15, readiness.sandboxGapCount * 5);
        riskScore += weight;
        addReason(reasons, 'readiness', 'sandbox_gaps', weight, `${readiness.sandboxGapCount} sandbox gaps`);
    }

    if (readiness.approvalErrorCount > 0) {
        const weight = Math.min(12, readiness.approvalErrorCount * 6);
        riskScore += weight;
        addReason(reasons, 'readiness', 'approval_policy_errors', weight, `${readiness.approvalErrorCount} approval policy errors`);
    }

    if (readiness.approvalRequiredCount >= thresholds.approvalBacklogWarnThreshold) {
        const weight = 6;
        riskScore += weight;
        addReason(reasons, 'readiness', 'approval_load_high', weight, `${readiness.approvalRequiredCount} approval-required steps`);
    }

    for (const alert of alerts) {
        const weight = AlertPriorityWeight[alert.priority] || 5;
        riskScore += weight;
        addReason(reasons, 'drift', alert.code, weight, alert.priority);
    }

    for (const incident of incidents) {
        const weight = IncidentPriorityWeight[incident.priority] || 6;
        riskScore += weight;
        addReason(reasons, 'incident', incident.code, weight, incident.priority);
    }

    if (queue.open >= thresholds.queueCriticalThreshold) {
        riskScore += 20;
        addReason(reasons, 'queue', 'queue_critical', 20, `open queue ${queue.open}`);
    } else if (queue.open >= thresholds.queueWarnThreshold) {
        riskScore += 10;
        addReason(reasons, 'queue', 'queue_warning', 10, `open queue ${queue.open}`);
    }

    if (queue.pendingApproval >= thresholds.pendingApprovalWarnThreshold) {
        riskScore += 8;
        addReason(reasons, 'queue', 'approval_backlog', 8, `pending approvals ${queue.pendingApproval}`);
    }

    const retryPressure = queue.retryScheduled + queue.timedOut;
    if (retryPressure >= thresholds.retryPressureWarnThreshold) {
        riskScore += 7;
        addReason(reasons, 'queue', 'retry_pressure', 7, `retry+timeout pressure ${retryPressure}`);
    }

    if (health.healthyRatio < 0.3) {
        riskScore += 22;
        addReason(reasons, 'health', 'healthy_ratio_critical', 22, `healthy ratio ${health.healthyRatio.toFixed(3)}`);
    } else if (health.healthyRatio < 0.5) {
        riskScore += 15;
        addReason(reasons, 'health', 'healthy_ratio_low', 15, `healthy ratio ${health.healthyRatio.toFixed(3)}`);
    } else if (health.healthyRatio < 0.7) {
        riskScore += 8;
        addReason(reasons, 'health', 'healthy_ratio_warn', 8, `healthy ratio ${health.healthyRatio.toFixed(3)}`);
    }

    if (health.staleRatio > 0.4) {
        riskScore += 8;
        addReason(reasons, 'health', 'stale_ratio_high', 8, `stale ratio ${health.staleRatio.toFixed(3)}`);
    }

    return {
        riskScore: Math.max(0, Math.min(100, Math.round(riskScore))),
        reasons
    };
}

function modeFromRiskScore(score, thresholds) {
    if (score >= thresholds.haltedThreshold) return 'halted';
    if (score >= thresholds.restrictedThreshold) return 'restricted';
    if (score >= thresholds.degradedThreshold) return 'degraded';
    return 'normal';
}

function buildDispatchPolicy(mode, {
    baseMaxConcurrentTasks = 12
} = {}) {
    const base = Math.max(1, Math.floor(safeNumber(baseMaxConcurrentTasks, 12)));

    if (mode === 'halted') {
        return {
            mode,
            throttleFactor: 0,
            maxConcurrentTasks: 0,
            blockedPriorities: ['low', 'normal', 'high', 'critical'],
            blockedRiskTags: ['production', 'security', 'finance', 'legal'],
            forceApprovalPriorities: ['critical'],
            allowOnlyTaskTags: ['recovery', 'mitigation', 'incident-response']
        };
    }

    if (mode === 'restricted') {
        return {
            mode,
            throttleFactor: 0.45,
            maxConcurrentTasks: Math.max(1, Math.floor(base * 0.45)),
            blockedPriorities: ['low'],
            blockedRiskTags: ['production'],
            forceApprovalPriorities: ['normal', 'high', 'critical'],
            allowOnlyTaskTags: []
        };
    }

    if (mode === 'degraded') {
        return {
            mode,
            throttleFactor: 0.75,
            maxConcurrentTasks: Math.max(1, Math.floor(base * 0.75)),
            blockedPriorities: [],
            blockedRiskTags: [],
            forceApprovalPriorities: ['high', 'critical'],
            allowOnlyTaskTags: []
        };
    }

    return {
        mode: 'normal',
        throttleFactor: 1,
        maxConcurrentTasks: base,
        blockedPriorities: [],
        blockedRiskTags: [],
        forceApprovalPriorities: [],
        allowOnlyTaskTags: []
    };
}

function buildRecommendedActions({
    mode,
    readiness,
    alerts,
    incidents,
    queue
}) {
    const actions = [];
    const push = (action) => actions.push({
        id: `action-${randomUUID().slice(0, 8)}`,
        priority: ActionPriority[action.type] || 'P2',
        ...action
    });

    if (mode === 'degraded' || mode === 'restricted' || mode === 'halted') {
        push({
            type: 'heighten_monitoring',
            title: 'Increase telemetry sampling and operator visibility',
            description: `Execution mode is ${mode}; enable enhanced observability.`
        });
    }

    if (readiness.missingCapabilityCount > 0) {
        push({
            type: 'provision_capabilities',
            title: 'Provision missing capability providers',
            description: `${readiness.missingCapabilityCount} capabilities are missing from healthy routing pools.`
        });
    }

    if (queue.open >= 25 || queue.retryScheduled + queue.timedOut >= 8) {
        push({
            type: 'drain_queue_pressure',
            title: 'Drain queue pressure and reroute backlog',
            description: `Queue pressure detected (open=${queue.open}, retry+timeout=${queue.retryScheduled + queue.timedOut}).`
        });
    }

    if (queue.pendingApproval >= 6) {
        push({
            type: 'assign_approval_surge',
            title: 'Add temporary approval reviewers',
            description: `Approval backlog is high (${queue.pendingApproval} pending).`
        });
    }

    if (alerts.some((alert) => alert.priority === 'P0' || alert.priority === 'P1')) {
        push({
            type: 'investigate_drift',
            title: 'Run focused drift investigation',
            description: 'High-priority drift alerts detected.'
        });
    }

    if (incidents.some((incident) => incident.priority === 'P0' || incident.priority === 'P1')) {
        push({
            type: 'invoke_recovery_supervisor',
            title: 'Invoke autonomous recovery supervisor plan',
            description: 'High-severity incidents are active; generate immediate recovery tasks.'
        });
    }

    if (mode === 'halted') {
        push({
            type: 'emergency_freeze',
            title: 'Apply temporary execution freeze',
            description: 'Risk score crossed halted threshold; allow only mitigation/recovery workloads.'
        });
    }

    const priorityRank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return actions.sort((a, b) => {
        const p = (priorityRank[a.priority] ?? 9) - (priorityRank[b.priority] ?? 9);
        if (p !== 0) return p;
        return String(a.type).localeCompare(String(b.type));
    });
}

export function evaluateExecutionGovernor(inputPayload, {
    thresholds = {},
    baseMaxConcurrentTasks = 12
} = {}) {
    const readiness = normalizeReadiness(inputPayload?.readinessReport);
    const alerts = normalizeAlerts(inputPayload?.driftReport ?? inputPayload?.driftAlerts);
    const incidents = normalizeIncidents(inputPayload?.incidents);
    const queue = normalizeQueue(inputPayload?.queueSummary);
    const health = normalizeHealth(inputPayload?.agentHealth);

    const mergedThresholds = {
        degradedThreshold: safeNumber(thresholds.degradedThreshold, 25),
        restrictedThreshold: safeNumber(thresholds.restrictedThreshold, 50),
        haltedThreshold: safeNumber(thresholds.haltedThreshold, 75),
        queueWarnThreshold: safeNumber(thresholds.queueWarnThreshold, 25),
        queueCriticalThreshold: safeNumber(thresholds.queueCriticalThreshold, 60),
        pendingApprovalWarnThreshold: safeNumber(thresholds.pendingApprovalWarnThreshold, 8),
        retryPressureWarnThreshold: safeNumber(thresholds.retryPressureWarnThreshold, 12),
        approvalBacklogWarnThreshold: safeNumber(thresholds.approvalBacklogWarnThreshold, 6)
    };

    const { riskScore, reasons } = evaluateRiskContributors({
        readiness,
        alerts,
        incidents,
        queue,
        health,
        thresholds: mergedThresholds
    });
    const mode = modeFromRiskScore(riskScore, mergedThresholds);
    const dispatchPolicy = buildDispatchPolicy(mode, {
        baseMaxConcurrentTasks
    });
    const recommendedActions = buildRecommendedActions({
        mode,
        readiness,
        alerts,
        incidents,
        queue
    });

    return {
        at: Date.now(),
        mode,
        riskScore,
        signalSummary: {
            readinessStatus: readiness.status,
            readinessScore: readiness.score,
            driftAlertCount: alerts.length,
            incidentCount: incidents.length,
            queueOpen: queue.open,
            queuePendingApproval: queue.pendingApproval,
            healthyAgentRatio: Number(health.healthyRatio.toFixed(4))
        },
        dispatchPolicy,
        reasons,
        recommendedActions
    };
}

export function buildGovernorTasks(decisionPayload, {
    fromAgentId = 'agent:execution-governor',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!decisionPayload || typeof decisionPayload !== 'object') {
        throw new Error('buildGovernorTasks requires execution governor decision payload');
    }

    const actions = Array.isArray(decisionPayload.recommendedActions)
        ? decisionPayload.recommendedActions
        : [];
    const targets = {
        ...ActionTargetMap,
        ...(targetMap || {})
    };
    const now = safeNow(Date.now);

    return actions.map((action, index) => buildTaskRequest({
        id: randomUUID(),
        from: fromAgentId,
        target: targets[action.type] || defaultTarget,
        priority: PriorityToTaskPriority[action.priority] || 'normal',
        task: `[${action.priority}] Execution governor: ${action.title}`,
        context: {
            governorMode: decisionPayload.mode,
            governorRiskScore: decisionPayload.riskScore,
            actionId: action.id,
            actionType: action.type,
            actionDescription: action.description
        },
        createdAt: now + index
    }));
}

export class ExecutionGovernor {
    constructor({
        localAgentId = 'agent:execution-governor',
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

    evaluate(inputPayload, options = {}) {
        const decision = evaluateExecutionGovernor(inputPayload, options);
        const stamped = {
            ...decision,
            at: safeNow(this.now)
        };
        this.history.push(stamped);
        if (this.history.length > this.maxHistory) {
            this.history.splice(0, this.history.length - this.maxHistory);
        }
        return clone(stamped);
    }

    buildActionTasks(decisionPayload, options = {}) {
        return buildGovernorTasks(decisionPayload, {
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

export const __executionGovernorInternals = {
    normalizeReadiness,
    normalizeAlerts,
    normalizeIncidents,
    normalizeQueue,
    normalizeHealth,
    evaluateRiskContributors,
    modeFromRiskScore,
    buildDispatchPolicy
};
