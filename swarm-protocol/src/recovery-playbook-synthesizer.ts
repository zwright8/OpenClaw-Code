import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    adopt_recovery_playbook: 'agent:ops',
    run_recovery_tabletop: 'agent:qa',
    automate_playbook_step: 'agent:platform',
    collect_recovery_telemetry: 'agent:monitoring',
    publish_recovery_brief: 'agent:ops'
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

function normalizeIncidents(inputPayload) {
    const incidents = Array.isArray(inputPayload?.incidents)
        ? inputPayload.incidents
        : [];

    return incidents
        .filter((incident) => incident && typeof incident === 'object')
        .map((incident, index) => ({
            incidentId: typeof incident.incidentId === 'string' && incident.incidentId.trim()
                ? incident.incidentId.trim()
                : `incident-${index + 1}`,
            category: typeof incident.category === 'string' && incident.category.trim()
                ? incident.category.trim()
                : 'general',
            severity: typeof incident.severity === 'string' && SeverityRank[incident.severity.trim()]
                ? incident.severity.trim()
                : 'medium',
            detectionLagMinutes: Math.max(0, safeNumber(incident.detectionLagMinutes, 12)),
            mitigationMinutes: Math.max(1, safeNumber(incident.mitigationMinutes, 35)),
            restorationMinutes: Math.max(1, safeNumber(incident.restorationMinutes, 60)),
            recurrenceRisk: clamp(safeNumber(incident.recurrenceRisk, 45)),
            impactedSystems: normalizeStringArray(incident.impactedSystems),
            rootCauseSignals: normalizeStringArray(incident.rootCauseSignals),
            successfulActions: normalizeStringArray(incident.successfulActions),
            failedActions: normalizeStringArray(incident.failedActions),
            telemetryCoverage: clamp(safeNumber(incident.telemetryCoverage, 62))
        }));
}

function bucketByCategory(incidents) {
    const groups = new Map();
    for (const incident of incidents) {
        const existing = groups.get(incident.category) || [];
        existing.push(incident);
        groups.set(incident.category, existing);
    }
    return groups;
}

function mostCommon(entries) {
    const counts = new Map();
    for (const entry of entries) {
        counts.set(entry, (counts.get(entry) || 0) + 1);
    }
    return [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([entry]) => entry);
}

function synthesizePlaybook(category, incidents) {
    const incidentCount = incidents.length;
    const avgDetectionLag = incidentCount > 0
        ? Number((incidents.reduce((acc, incident) => acc + incident.detectionLagMinutes, 0) / incidentCount).toFixed(2))
        : 0;
    const avgMitigation = incidentCount > 0
        ? Number((incidents.reduce((acc, incident) => acc + incident.mitigationMinutes, 0) / incidentCount).toFixed(2))
        : 0;
    const avgRestoration = incidentCount > 0
        ? Number((incidents.reduce((acc, incident) => acc + incident.restorationMinutes, 0) / incidentCount).toFixed(2))
        : 0;
    const avgRecurrenceRisk = incidentCount > 0
        ? Number((incidents.reduce((acc, incident) => acc + incident.recurrenceRisk, 0) / incidentCount).toFixed(2))
        : 0;
    const avgTelemetryCoverage = incidentCount > 0
        ? Number((incidents.reduce((acc, incident) => acc + incident.telemetryCoverage, 0) / incidentCount).toFixed(2))
        : 0;
    const severityWeighted = incidentCount > 0
        ? incidents.reduce((acc, incident) => acc + SeverityRank[incident.severity], 0) / incidentCount
        : 1;

    const rootSignals = mostCommon(incidents.flatMap((incident) => incident.rootCauseSignals)).slice(0, 4);
    const successfulActions = mostCommon(incidents.flatMap((incident) => incident.successfulActions)).slice(0, 6);
    const failedActions = mostCommon(incidents.flatMap((incident) => incident.failedActions)).slice(0, 4);
    const impactedSystems = [...new Set(incidents.flatMap((incident) => incident.impactedSystems))];

    const recoveryTargetMinutes = Math.round(
        avgDetectionLag * 0.35
        + avgMitigation * 0.25
        + avgRestoration * 0.4
    );

    const confidenceScore = clamp(Math.round(
        (incidentCount >= 4 ? 32 : incidentCount * 7)
        + avgTelemetryCoverage * 0.34
        + (100 - avgRecurrenceRisk) * 0.26
        + (successfulActions.length > 0 ? 8 : 0)
        - (failedActions.length * 4)
    ));

    const playbookSteps = {
        detect: [
            `Monitor signals: ${rootSignals.join(', ') || 'service_health, error_rate'}.`,
            `Trigger incident when anomaly persists for ${Math.max(3, Math.round(avgDetectionLag * 0.4))} minutes.`
        ],
        contain: [
            successfulActions[0]
                ? `Execute containment action: ${successfulActions[0]}.`
                : 'Execute predefined containment fallback.',
            `Isolate impacted systems: ${impactedSystems.join(', ') || 'critical systems'}.`
        ],
        restore: [
            successfulActions[1]
                ? `Apply restoration action: ${successfulActions[1]}.`
                : 'Restore baseline service using rollback and failover controls.',
            `Target recovery within ${recoveryTargetMinutes} minutes.`
        ],
        verify: [
            `Validate health metrics return to baseline for ${Math.max(10, Math.round(avgMitigation * 0.3))} minutes.`,
            'Confirm error budget and customer impact trend are improving.'
        ],
        communicate: [
            'Publish incident status, mitigation progress, and ETA updates to stakeholders.',
            'Record root-cause hypotheses and unresolved unknowns for post-incident review.'
        ]
    };

    const automationCandidates = [
        ...successfulActions.slice(0, 3),
        ...(avgTelemetryCoverage < 70 ? ['Increase automated telemetry sampling and alert routing.'] : [])
    ].filter(Boolean);

    let posture = 'adopt_ready';
    if (confidenceScore < 50 || incidentCount < 2) posture = 'needs_validation';
    if (confidenceScore < 38 || avgRecurrenceRisk > 78) posture = 'high_risk';

    return {
        playbookId: `playbook-${category}`,
        category,
        posture,
        incidentCount,
        impactedSystems,
        rootSignals,
        successfulActions,
        failedActions,
        avgDetectionLag,
        avgMitigation,
        avgRestoration,
        avgRecurrenceRisk,
        avgTelemetryCoverage,
        severityWeighted: Number(severityWeighted.toFixed(2)),
        recoveryTargetMinutes,
        confidenceScore,
        playbookSteps,
        automationCandidates
    };
}

function summarizePlaybooks(playbooks) {
    const avgConfidenceScore = playbooks.length > 0
        ? Number((playbooks.reduce((acc, playbook) => acc + playbook.confidenceScore, 0) / playbooks.length).toFixed(2))
        : 0;
    const highRiskCount = playbooks.filter((playbook) => playbook.posture === 'high_risk').length;
    const needsValidationCount = playbooks.filter((playbook) => playbook.posture === 'needs_validation').length;

    let posture = 'ready';
    if (highRiskCount > 0 || avgConfidenceScore < 50) posture = 'critical';
    else if (needsValidationCount > 0 || avgConfidenceScore < 68) posture = 'review_required';

    return {
        playbookCount: playbooks.length,
        adoptReadyCount: playbooks.filter((playbook) => playbook.posture === 'adopt_ready').length,
        needsValidationCount,
        highRiskCount,
        avgConfidenceScore,
        posture
    };
}

function buildAlerts(summary, playbooks) {
    const alerts = [];
    if (summary.highRiskCount > 0) alerts.push('recovery_playbook_high_risk');
    if (summary.needsValidationCount > 0) alerts.push('recovery_playbook_validation_required');
    if (summary.avgConfidenceScore < 60) alerts.push('recovery_playbook_confidence_low');
    if (playbooks.some((playbook) => playbook.avgTelemetryCoverage < 65)) alerts.push('recovery_telemetry_gap');
    if (playbooks.some((playbook) => playbook.avgRecurrenceRisk > 70)) alerts.push('recovery_recurrence_risk_high');
    return alerts;
}

function buildRecommendations(playbooks, summary, alerts) {
    const recommendations = [];
    for (const playbook of playbooks) {
        if (playbook.posture === 'adopt_ready') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'adopt_recovery_playbook',
                playbookId: playbook.playbookId,
                category: playbook.category,
                title: `Adopt ${playbook.category} recovery playbook`,
                description: `Confidence ${playbook.confidenceScore} with target recovery ${playbook.recoveryTargetMinutes} minutes.`,
                priority: 'P1'
            });
        } else {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'run_recovery_tabletop',
                playbookId: playbook.playbookId,
                category: playbook.category,
                title: `Run tabletop for ${playbook.category} playbook`,
                description: `Playbook posture ${playbook.posture} requires validation.`,
                priority: playbook.posture === 'high_risk' ? 'P0' : 'P1'
            });
        }

        for (const candidate of playbook.automationCandidates.slice(0, 2)) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'automate_playbook_step',
                playbookId: playbook.playbookId,
                category: playbook.category,
                title: `Automate recovery step for ${playbook.category}`,
                description: candidate,
                priority: playbook.posture === 'high_risk' ? 'P1' : 'P2'
            });
        }

        if (playbook.avgTelemetryCoverage < 70) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'collect_recovery_telemetry',
                playbookId: playbook.playbookId,
                category: playbook.category,
                title: `Increase telemetry collection for ${playbook.category}`,
                description: `Telemetry coverage ${playbook.avgTelemetryCoverage} is below threshold.`,
                priority: 'P1'
            });
        }
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_recovery_brief',
            title: 'Publish recovery playbook brief',
            description: 'Share synthesized playbooks, confidence scores, and adoption priorities.',
            priority: alerts.includes('recovery_playbook_high_risk') ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.playbookId || '').localeCompare(String(b.playbookId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type
            && String(other.playbookId || '') === String(entry.playbookId || '')
            && String(other.description || '') === String(entry.description || '')
        )) === index);
}

export function synthesizeRecoveryPlaybooks(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const incidents = normalizeIncidents(inputPayload || {});
    const groups = bucketByCategory(incidents);
    const playbooks = [...groups.entries()].map(([category, categoryIncidents]) => (
        synthesizePlaybook(category, categoryIncidents)
    )).sort((a, b) => {
        const postureRank = { high_risk: 0, needs_validation: 1, adopt_ready: 2 };
        const p = postureRank[a.posture] - postureRank[b.posture];
        if (p !== 0) return p;
        return b.avgRecurrenceRisk - a.avgRecurrenceRisk;
    });
    const summary = summarizePlaybooks(playbooks);
    const alerts = buildAlerts(summary, playbooks);
    const recommendations = buildRecommendations(playbooks, summary, alerts);

    return {
        at,
        summary,
        playbooks,
        alerts,
        recommendations
    };
}

export function recoveryPlaybooksToTasks(reportPayload, {
    fromAgentId = 'agent:recovery-playbook',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('recoveryPlaybooksToTasks requires report payload');
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
            playbookId: recommendation.playbookId || null,
            category: recommendation.category || null,
            posture: reportPayload.summary?.posture || null,
            highRiskCount: reportPayload.summary?.highRiskCount || 0
        },
        createdAt: nowMs + index
    }));
}

export class RecoveryPlaybookSynthesizer {
    constructor({
        localAgentId = 'agent:recovery-playbook',
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
        const report = synthesizeRecoveryPlaybooks(inputPayload, {
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
        return recoveryPlaybooksToTasks(reportPayload, {
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

export const __recoveryPlaybookSynthesizerInternals = {
    normalizeIncidents,
    bucketByCategory,
    synthesizePlaybook,
    summarizePlaybooks,
    buildRecommendations
};
