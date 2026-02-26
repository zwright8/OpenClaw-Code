import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    publish_incident_update: 'agent:ops',
    request_incident_fact_check: 'agent:analysis',
    schedule_next_incident_update: 'agent:ops',
    escalate_executive_brief: 'agent:ops-lead'
};

const RecommendationPriorityTaskMap = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
};

const SeverityRank = {
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

function normalizeIncidents(inputPayload, nowMs) {
    const incidents = Array.isArray(inputPayload?.incidents)
        ? inputPayload.incidents
        : [];

    return incidents
        .filter((incident) => incident && typeof incident === 'object')
        .map((incident, index) => {
            const startedAt = safeNumber(incident.startedAt, nowMs);
            const detectedAt = safeNumber(incident.detectedAt, startedAt);
            const severity = typeof incident.severity === 'string' && SeverityRank[incident.severity.trim()]
                ? incident.severity.trim()
                : 'medium';
            const status = typeof incident.status === 'string' && incident.status.trim()
                ? incident.status.trim()
                : 'investigating';

            return {
                incidentId: typeof incident.incidentId === 'string' && incident.incidentId.trim()
                    ? incident.incidentId.trim()
                    : `incident-${index + 1}`,
                title: typeof incident.title === 'string' && incident.title.trim()
                    ? incident.title.trim()
                    : `Incident ${index + 1}`,
                severity,
                status,
                startedAt,
                detectedAt,
                affectedServices: normalizeStringArray(incident.affectedServices),
                regions: normalizeStringArray(incident.regions),
                customerImpact: typeof incident.customerImpact === 'string' && incident.customerImpact.trim()
                    ? incident.customerImpact.trim()
                    : 'Impact under assessment.',
                internalImpact: typeof incident.internalImpact === 'string' && incident.internalImpact.trim()
                    ? incident.internalImpact.trim()
                    : 'Operational impact under assessment.',
                summary: typeof incident.summary === 'string' && incident.summary.trim()
                    ? incident.summary.trim()
                    : 'Investigation in progress.',
                mitigationActions: normalizeStringArray(incident.mitigationActions),
                nextUpdateAt: safeNumber(incident.nextUpdateAt, nowMs + 30 * 60_000),
                etaResolutionAt: incident.etaResolutionAt === null
                    ? null
                    : safeNumber(incident.etaResolutionAt, null),
                unknowns: normalizeStringArray(incident.unknowns),
                confidence: clamp(safeNumber(incident.confidence, 68))
            };
        });
}

function normalizeAudiences(inputPayload) {
    const audiences = Array.isArray(inputPayload?.audiences)
        ? inputPayload.audiences
        : [];
    const normalized = audiences
        .filter((audience) => audience && typeof audience === 'object')
        .map((audience, index) => ({
            id: typeof audience.id === 'string' && audience.id.trim()
                ? audience.id.trim()
                : `audience-${index + 1}`,
            label: typeof audience.label === 'string' && audience.label.trim()
                ? audience.label.trim()
                : `Audience ${index + 1}`,
            detailLevel: typeof audience.detailLevel === 'string' && audience.detailLevel.trim()
                ? audience.detailLevel.trim()
                : 'standard',
            includeInternal: audience.includeInternal === true,
            updateCadenceMinutes: Math.max(5, Math.floor(safeNumber(audience.updateCadenceMinutes, 30)))
        }));

    if (normalized.length > 0) return normalized;
    return [
        { id: 'ops', label: 'Operations', detailLevel: 'deep', includeInternal: true, updateCadenceMinutes: 20 },
        { id: 'customers', label: 'Customers', detailLevel: 'concise', includeInternal: false, updateCadenceMinutes: 45 },
        { id: 'executives', label: 'Executives', detailLevel: 'summary', includeInternal: true, updateCadenceMinutes: 30 }
    ];
}

function impactLine(incident, audience) {
    if (audience.includeInternal) {
        return `${incident.customerImpact} Internal: ${incident.internalImpact}`;
    }
    return incident.customerImpact;
}

function unknownsLine(incident) {
    if (incident.unknowns.length === 0) return 'No major unknowns currently tracked.';
    return `Open unknowns: ${incident.unknowns.join('; ')}.`;
}

function buildMessage(incident, audience, nowMs) {
    const ageMinutes = Math.max(0, (nowMs - incident.startedAt) / 60_000);
    const severityLabel = incident.severity.toUpperCase();
    const headline = `[${severityLabel}] ${incident.title} (${incident.status})`;
    const services = incident.affectedServices.length > 0
        ? incident.affectedServices.join(', ')
        : 'unspecified services';
    const regions = incident.regions.length > 0
        ? incident.regions.join(', ')
        : 'unspecified regions';
    const mitigation = incident.mitigationActions.length > 0
        ? incident.mitigationActions.join('; ')
        : 'Mitigations are being prepared.';
    const etaText = incident.etaResolutionAt
        ? `Estimated resolution at ${new Date(incident.etaResolutionAt).toISOString()}.`
        : 'Estimated resolution is not yet confirmed.';
    const nextUpdateText = `Next update by ${new Date(incident.nextUpdateAt).toISOString()}.`;

    const bodyLines = [
        `${incident.summary}`,
        `Affected services: ${services}. Regions: ${regions}.`,
        `Impact: ${impactLine(incident, audience)}`,
        `Mitigation: ${mitigation}`,
        `${etaText} ${nextUpdateText}`
    ];

    if (audience.detailLevel !== 'concise') {
        bodyLines.push(unknownsLine(incident));
        bodyLines.push(`Incident age: ${Math.round(ageMinutes)} minutes. Confidence: ${incident.confidence}%.`);
    }

    const clarityScore = clamp(Math.round(
        (incident.summary.length >= 24 ? 24 : 10)
        + (incident.customerImpact.length >= 16 ? 20 : 8)
        + (incident.mitigationActions.length > 0 ? 18 : 8)
        + (incident.nextUpdateAt ? 16 : 0)
        + (incident.etaResolutionAt ? 12 : 0)
        + (incident.unknowns.length <= 2 ? 10 : 4)
    ));
    const uncertaintyScore = clamp(Math.round(
        (incident.unknowns.length * 18)
        + (incident.etaResolutionAt ? 0 : 18)
        + (100 - incident.confidence) * 0.44
    ));

    return {
        messageId: `message-${randomUUID().slice(0, 10)}`,
        incidentId: incident.incidentId,
        audienceId: audience.id,
        audienceLabel: audience.label,
        headline,
        body: bodyLines.join('\n'),
        clarityScore,
        uncertaintyScore,
        publishBy: Math.min(incident.nextUpdateAt, nowMs + audience.updateCadenceMinutes * 60_000),
        recommendedCadenceMinutes: audience.updateCadenceMinutes,
        severity: incident.severity,
        status: incident.status
    };
}

function synthesizeMessages(incidents, audiences, nowMs) {
    const messages = [];
    for (const incident of incidents) {
        for (const audience of audiences) {
            messages.push(buildMessage(incident, audience, nowMs));
        }
    }
    return messages.sort((a, b) => {
        const severityDiff = SeverityRank[b.severity] - SeverityRank[a.severity];
        if (severityDiff !== 0) return severityDiff;
        return a.publishBy - b.publishBy;
    });
}

function summarize(messages) {
    const avgClarityScore = messages.length > 0
        ? Number((messages.reduce((acc, message) => acc + message.clarityScore, 0) / messages.length).toFixed(2))
        : 0;
    const avgUncertaintyScore = messages.length > 0
        ? Number((messages.reduce((acc, message) => acc + message.uncertaintyScore, 0) / messages.length).toFixed(2))
        : 0;
    const urgentMessageCount = messages.filter((message) => message.publishBy <= Date.now() + 15 * 60_000).length;

    let posture = 'ready';
    if (avgClarityScore < 65 || avgUncertaintyScore > 70) posture = 'review_required';
    if (avgClarityScore < 52 || avgUncertaintyScore > 82) posture = 'critical';

    return {
        messageCount: messages.length,
        avgClarityScore,
        avgUncertaintyScore,
        urgentMessageCount,
        posture
    };
}

function buildAlerts(summary, messages, incidents) {
    const alerts = [];
    if (summary.avgClarityScore < 65) alerts.push('incident_message_clarity_low');
    if (summary.avgUncertaintyScore > 70) alerts.push('incident_uncertainty_high');
    if (summary.urgentMessageCount > 0) alerts.push('incident_update_due_soon');
    if (incidents.some((incident) => !incident.etaResolutionAt)) alerts.push('incident_eta_missing');
    if (messages.some((message) => message.uncertaintyScore >= 80)) alerts.push('incident_fact_confidence_low');
    return alerts;
}

function buildRecommendations(summary, messages, alerts) {
    const recommendations = [];
    const urgent = messages.filter((message) => message.publishBy <= Date.now() + 30 * 60_000)
        .slice(0, 8);
    for (const message of urgent) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_incident_update',
            incidentId: message.incidentId,
            audienceId: message.audienceId,
            title: `Publish incident update for ${message.audienceLabel}`,
            description: `${message.headline}`,
            priority: message.severity === 'critical' ? 'P0' : 'P1'
        });
    }

    if (alerts.includes('incident_fact_confidence_low') || alerts.includes('incident_uncertainty_high')) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'request_incident_fact_check',
            title: 'Request incident fact-check pass',
            description: 'High uncertainty or low confidence detected in incident communications.',
            priority: 'P1'
        });
    }

    if (alerts.includes('incident_update_due_soon')) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'schedule_next_incident_update',
            title: 'Schedule next incident communication cycle',
            description: 'At least one audience update is due imminently.',
            priority: 'P1'
        });
    }

    if (summary.posture === 'critical') {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'escalate_executive_brief',
            title: 'Escalate executive incident briefing',
            description: 'Communication clarity and uncertainty posture is critical.',
            priority: 'P0'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.incidentId || '').localeCompare(String(b.incidentId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type
            && String(other.incidentId || '') === String(entry.incidentId || '')
            && String(other.audienceId || '') === String(entry.audienceId || '')
        )) === index);
}

export function synthesizeIncidentCommunications(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const incidents = normalizeIncidents(inputPayload || {}, at);
    const audiences = normalizeAudiences(inputPayload || {});
    const messages = synthesizeMessages(incidents, audiences, at);
    const summary = summarize(messages);
    const alerts = buildAlerts(summary, messages, incidents);
    const recommendations = buildRecommendations(summary, messages, alerts);

    return {
        at,
        summary,
        messages,
        alerts,
        recommendations
    };
}

export function incidentCommunicationsToTasks(reportPayload, {
    fromAgentId = 'agent:incident-comms',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('incidentCommunicationsToTasks requires report payload');
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
            incidentId: recommendation.incidentId || null,
            audienceId: recommendation.audienceId || null,
            posture: reportPayload.summary?.posture || null,
            urgentMessageCount: reportPayload.summary?.urgentMessageCount || 0
        },
        createdAt: nowMs + index
    }));
}

export class IncidentCommunicationSynthesizer {
    constructor({
        localAgentId = 'agent:incident-comms',
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
        const report = synthesizeIncidentCommunications(inputPayload, {
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
        return incidentCommunicationsToTasks(reportPayload, {
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

export const __incidentCommunicationSynthesizerInternals = {
    normalizeIncidents,
    normalizeAudiences,
    buildMessage,
    summarize,
    buildRecommendations
};
