import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const PriorityToTaskPriority = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
};

const ActionTargetMap = {
    emergency_freeze: 'agent:ops',
    invoke_recovery_supervisor: 'agent:recovery',
    investigate_drift: 'agent:routing',
    provision_capabilities: 'agent:skills',
    drain_queue_pressure: 'agent:ops',
    assign_approval_surge: 'agent:ops',
    heighten_monitoring: 'agent:observability',
    missing_capability: 'agent:skills',
    missing_sandbox_profile: 'agent:platform',
    sandbox_blocked_risk_tag: 'agent:platform',
    sandbox_disallowed_capability: 'agent:platform',
    approval_policy_error: 'agent:ops',
    approval_reviewer_unset: 'agent:ops',
    budget_overrun: 'agent:finance',
    duration_overrun: 'agent:planning'
};

const SeverityOrder = {
    normal: 0,
    elevated: 1,
    high: 2,
    critical: 3
};

const PriorityOrder = {
    P0: 0,
    P1: 1,
    P2: 2,
    P3: 3
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

function normalizeReadiness(readinessPayload) {
    const source = readinessPayload && typeof readinessPayload === 'object'
        ? readinessPayload
        : {};

    return {
        status: source.status || 'ready',
        readinessScore: safeNumber(source.readinessScore, 100),
        summary: {
            missingCapabilityCount: safeNumber(source?.summary?.missingCapabilityCount, 0),
            sandboxGapCount: safeNumber(source?.summary?.sandboxGapCount, 0),
            approvalRequiredCount: safeNumber(source?.summary?.approvalRequiredCount, 0),
            approvalErrorCount: safeNumber(source?.summary?.approvalErrorCount, 0)
        },
        remediation: Array.isArray(source.remediation)
            ? source.remediation.map((item, index) => ({
                id: item?.id || `readiness-action-${index + 1}`,
                code: item?.code || 'readiness_action',
                title: item?.title || item?.code || 'Readiness remediation',
                description: item?.description || '',
                priority: normalizePriority(item?.priority)
            }))
            : []
    };
}

function normalizeGovernor(governorPayload) {
    const source = governorPayload && typeof governorPayload === 'object'
        ? governorPayload
        : {};
    return {
        mode: source.mode || 'normal',
        riskScore: safeNumber(source.riskScore, 0),
        reasons: Array.isArray(source.reasons)
            ? source.reasons.map((reason, index) => ({
                id: reason?.id || `governor-reason-${index + 1}`,
                source: reason?.source || 'governor',
                code: reason?.code || 'risk_signal',
                detail: reason?.detail || '',
                weight: safeNumber(reason?.weight, 0)
            }))
            : [],
        recommendedActions: Array.isArray(source.recommendedActions)
            ? source.recommendedActions.map((item, index) => ({
                id: item?.id || `governor-action-${index + 1}`,
                code: item?.type || 'governor_action',
                title: item?.title || item?.type || 'Governor action',
                description: item?.description || '',
                priority: normalizePriority(item?.priority)
            }))
            : []
    };
}

function normalizeAlerts(alertPayload) {
    const source = Array.isArray(alertPayload)
        ? alertPayload
        : (Array.isArray(alertPayload?.alerts) ? alertPayload.alerts : []);

    return source.map((alert, index) => ({
        id: alert?.id || `alert-${index + 1}`,
        code: alert?.code || 'drift_alert',
        priority: normalizePriority(alert?.priority),
        summary: alert?.summary || alert?.code || 'Drift alert'
    }));
}

function normalizeIncidents(incidentPayload) {
    const source = Array.isArray(incidentPayload)
        ? incidentPayload
        : (Array.isArray(incidentPayload?.incidents) ? incidentPayload.incidents : []);

    return source.map((incident, index) => ({
        id: incident?.id || `incident-${index + 1}`,
        code: incident?.code || 'incident',
        priority: normalizePriority(incident?.priority),
        summary: incident?.summary || incident?.code || 'Incident'
    }));
}

function deriveSeverity({ readiness, governor, alerts, incidents }) {
    let severity = 'normal';

    if (
        readiness.status === 'blocked'
        || governor.mode === 'halted'
        || incidents.some((incident) => incident.priority === 'P0')
    ) {
        severity = 'critical';
    } else if (
        readiness.status === 'needs_attention'
        || governor.mode === 'restricted'
        || incidents.some((incident) => incident.priority === 'P1')
        || alerts.some((alert) => alert.priority === 'P1')
    ) {
        severity = 'high';
    } else if (
        governor.mode === 'degraded'
        || alerts.length > 0
        || incidents.length > 0
    ) {
        severity = 'elevated';
    }

    return severity;
}

function deriveHeadline({ severity, readiness, governor, alerts, incidents }) {
    if (severity === 'critical') {
        return `Critical execution risk: mode ${governor.mode}, readiness ${readiness.status}, incidents ${incidents.length}`;
    }
    if (severity === 'high') {
        return `High attention required: mode ${governor.mode}, drift alerts ${alerts.length}, incidents ${incidents.length}`;
    }
    if (severity === 'elevated') {
        return `Elevated risk posture: monitor active signals and keep mitigations ready`;
    }
    return 'System stable: no urgent intervention required';
}

function buildConcerns({ readiness, governor, alerts, incidents }, { maxConcerns = 8 } = {}) {
    const concerns = [];

    if (readiness.status === 'blocked') {
        concerns.push({
            source: 'readiness',
            priority: 'P0',
            title: 'Mission readiness is blocked',
            detail: `Missing capabilities: ${readiness.summary.missingCapabilityCount}; sandbox gaps: ${readiness.summary.sandboxGapCount}`
        });
    } else if (readiness.status === 'needs_attention') {
        concerns.push({
            source: 'readiness',
            priority: 'P1',
            title: 'Mission readiness requires attention',
            detail: `Readiness score ${readiness.readinessScore}`
        });
    }

    if (governor.mode === 'halted') {
        concerns.push({
            source: 'governor',
            priority: 'P0',
            title: 'Execution governor halted dispatch',
            detail: `Risk score ${governor.riskScore}`
        });
    } else if (governor.mode === 'restricted' || governor.mode === 'degraded') {
        concerns.push({
            source: 'governor',
            priority: governor.mode === 'restricted' ? 'P1' : 'P2',
            title: `Execution governor mode ${governor.mode}`,
            detail: `Risk score ${governor.riskScore}`
        });
    }

    const topReasons = [...governor.reasons]
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 3);
    for (const reason of topReasons) {
        concerns.push({
            source: 'governor',
            priority: reason.weight >= 15 ? 'P1' : 'P2',
            title: `Risk signal: ${reason.code}`,
            detail: reason.detail || `Weight ${reason.weight}`
        });
    }

    for (const alert of alerts.slice(0, 3)) {
        concerns.push({
            source: 'drift',
            priority: alert.priority,
            title: `Drift alert: ${alert.code}`,
            detail: alert.summary
        });
    }

    for (const incident of incidents.slice(0, 3)) {
        concerns.push({
            source: 'incident',
            priority: incident.priority,
            title: `Incident: ${incident.code}`,
            detail: incident.summary
        });
    }

    return concerns
        .sort((a, b) => {
            const p = (PriorityOrder[a.priority] ?? 9) - (PriorityOrder[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.title).localeCompare(String(b.title));
        })
        .slice(0, Math.max(1, Number(maxConcerns) || 8));
}

function buildActions({ readiness, governor, alerts, incidents }, { maxActions = 12 } = {}) {
    const dedup = new Map();
    const actions = [];

    const upsert = (action) => {
        const key = `${action.source}|${action.code}`;
        if (dedup.has(key)) return;
        dedup.set(key, true);
        actions.push(action);
    };

    for (const action of readiness.remediation) {
        upsert({
            id: action.id,
            source: 'readiness',
            code: action.code,
            title: action.title,
            description: action.description,
            priority: action.priority
        });
    }

    for (const action of governor.recommendedActions) {
        upsert({
            id: action.id,
            source: 'governor',
            code: action.code,
            title: action.title,
            description: action.description,
            priority: action.priority
        });
    }

    for (const incident of incidents) {
        if (incident.priority === 'P0' || incident.priority === 'P1') {
            upsert({
                id: `incident-followup-${incident.id}`,
                source: 'incident',
                code: `investigate_${incident.code}`,
                title: `Investigate incident ${incident.code}`,
                description: incident.summary,
                priority: 'P1'
            });
        }
    }

    for (const alert of alerts) {
        if (alert.priority === 'P0' || alert.priority === 'P1') {
            upsert({
                id: `drift-followup-${alert.id}`,
                source: 'drift',
                code: `triage_${alert.code}`,
                title: `Triage drift alert ${alert.code}`,
                description: alert.summary,
                priority: 'P2'
            });
        }
    }

    return actions
        .sort((a, b) => {
            const p = (PriorityOrder[a.priority] ?? 9) - (PriorityOrder[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.title).localeCompare(String(b.title));
        })
        .slice(0, Math.max(1, Number(maxActions) || 12));
}

export function buildCommandBrief(inputPayload, {
    maxConcerns = 8,
    maxActions = 12
} = {}) {
    const readiness = normalizeReadiness(inputPayload?.readinessReport);
    const governor = normalizeGovernor(inputPayload?.governorDecision);
    const alerts = normalizeAlerts(inputPayload?.driftReport ?? inputPayload?.driftAlerts);
    const incidents = normalizeIncidents(inputPayload?.incidents);

    const severity = deriveSeverity({
        readiness,
        governor,
        alerts,
        incidents
    });
    const headline = deriveHeadline({
        severity,
        readiness,
        governor,
        alerts,
        incidents
    });
    const concerns = buildConcerns({
        readiness,
        governor,
        alerts,
        incidents
    }, { maxConcerns });
    const actions = buildActions({
        readiness,
        governor,
        alerts,
        incidents
    }, { maxActions });

    return {
        at: Date.now(),
        severity,
        headline,
        summary: {
            readinessStatus: readiness.status,
            readinessScore: readiness.readinessScore,
            governorMode: governor.mode,
            governorRiskScore: governor.riskScore,
            driftAlertCount: alerts.length,
            incidentCount: incidents.length,
            concernCount: concerns.length,
            actionCount: actions.length
        },
        concerns,
        actions,
        signals: {
            readiness,
            governor,
            alerts,
            incidents
        }
    };
}

export function commandBriefToMarkdown(briefPayload) {
    if (!briefPayload || typeof briefPayload !== 'object') {
        throw new Error('commandBriefToMarkdown requires command brief object');
    }

    const brief = briefPayload;
    const lines = [
        '# Command Briefing',
        '',
        `- Severity: ${brief.severity}`,
        `- Headline: ${brief.headline}`,
        `- Readiness: ${brief.summary?.readinessStatus} (${brief.summary?.readinessScore})`,
        `- Governor: ${brief.summary?.governorMode} (risk ${brief.summary?.governorRiskScore})`,
        `- Drift Alerts: ${brief.summary?.driftAlertCount}`,
        `- Incidents: ${brief.summary?.incidentCount}`,
        ''
    ];

    lines.push('## Top Concerns');
    if (Array.isArray(brief.concerns) && brief.concerns.length > 0) {
        for (const concern of brief.concerns) {
            lines.push(`- [${concern.priority}] ${concern.title}: ${concern.detail}`);
        }
    } else {
        lines.push('- None');
    }

    lines.push('', '## Recommended Actions');
    if (Array.isArray(brief.actions) && brief.actions.length > 0) {
        for (const action of brief.actions) {
            lines.push(`- [${action.priority}] (${action.source}) ${action.title}`);
        }
    } else {
        lines.push('- None');
    }

    return lines.join('\n');
}

export function commandBriefToTaskRequests(briefPayload, {
    fromAgentId = 'agent:command-briefing',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!briefPayload || typeof briefPayload !== 'object') {
        throw new Error('commandBriefToTaskRequests requires command brief object');
    }

    const actions = Array.isArray(briefPayload.actions) ? briefPayload.actions : [];
    const targets = {
        ...ActionTargetMap,
        ...(targetMap || {})
    };
    const now = safeNow(Date.now);

    return actions.map((action, index) => buildTaskRequest({
        id: randomUUID(),
        from: fromAgentId,
        target: targets[action.code] || defaultTarget,
        priority: PriorityToTaskPriority[action.priority] || 'normal',
        task: `[${action.priority}] Command briefing action: ${action.title}`,
        context: {
            briefingSeverity: briefPayload.severity,
            briefingHeadline: briefPayload.headline,
            actionSource: action.source,
            actionCode: action.code,
            actionDescription: action.description
        },
        createdAt: now + index
    }));
}

export class CommandBriefingCenter {
    constructor({
        localAgentId = 'agent:command-briefing',
        now = Date.now,
        maxHistory = 200
    } = {}) {
        this.localAgentId = localAgentId;
        this.now = typeof now === 'function' ? now : Date.now;
        this.maxHistory = Number.isInteger(maxHistory) && maxHistory > 0
            ? maxHistory
            : 200;
        this.history = [];
    }

    createBrief(inputPayload, options = {}) {
        const brief = buildCommandBrief(inputPayload, options);
        const stamped = {
            ...brief,
            at: safeNow(this.now)
        };
        this.history.push(stamped);
        if (this.history.length > this.maxHistory) {
            this.history.splice(0, this.history.length - this.maxHistory);
        }
        return clone(stamped);
    }

    buildActionTasks(briefPayload, options = {}) {
        return commandBriefToTaskRequests(briefPayload, {
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

export const __commandBriefingInternals = {
    normalizeReadiness,
    normalizeGovernor,
    normalizeAlerts,
    normalizeIncidents,
    deriveSeverity,
    deriveHeadline,
    buildConcerns,
    buildActions
};
