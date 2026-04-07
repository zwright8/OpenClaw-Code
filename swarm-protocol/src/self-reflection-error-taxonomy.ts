import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    run_error_taxonomy_review: 'agent:review',
    add_taxonomy_regression_guard: 'agent:quality',
    publish_reflection_taxonomy_digest: 'agent:ops'
};

const RecommendationPriorityTaskMap = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
};

const TaxonomyRules = [
    { code: 'evidence_failure', keywords: ['hallucination', 'fabricated', 'unsupported', 'evidence'] },
    { code: 'planning_failure', keywords: ['missed dependency', 'plan', 'scope', 'sequencing'] },
    { code: 'execution_failure', keywords: ['timeout', 'retry', 'runtime', 'execution'] },
    { code: 'coordination_failure', keywords: ['handoff', 'routing', 'conflict', 'agent'] },
    { code: 'safety_failure', keywords: ['safety', 'privacy', 'policy', 'harm'] }
];

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

function normalizeIncidents(inputPayload) {
    const source = Array.isArray(inputPayload?.incidents)
        ? inputPayload.incidents
        : [];

    return source
        .filter((incident) => incident && typeof incident === 'object')
        .map((incident, index) => ({
            incidentId: typeof incident.incidentId === 'string' && incident.incidentId.trim()
                ? incident.incidentId.trim()
                : `incident-${index + 1}`,
            summary: typeof incident.summary === 'string' && incident.summary.trim()
                ? incident.summary.trim()
                : '',
            severity: clamp(safeNumber(incident.severity, 55)),
            recurrence: Math.max(1, Math.floor(safeNumber(incident.recurrence, 1))),
            phase: typeof incident.phase === 'string' && incident.phase.trim()
                ? incident.phase.trim()
                : 'unknown',
            tags: Array.isArray(incident.tags)
                ? incident.tags.filter((tag) => typeof tag === 'string' && tag.trim()).map((tag) => tag.trim().toLowerCase())
                : []
        }));
}

function classifyIncident(incident) {
    const text = `${incident.summary} ${incident.tags.join(' ')}`.toLowerCase();

    let best = {
        taxonomyCode: 'unknown_failure',
        keywordHits: 0
    };

    for (const rule of TaxonomyRules) {
        let hits = 0;
        for (const keyword of rule.keywords) {
            if (text.includes(keyword)) hits += 1;
        }
        if (hits > best.keywordHits) {
            best = {
                taxonomyCode: rule.code,
                keywordHits: hits
            };
        }
    }

    return best;
}

function buildTaxonomy(incidents) {
    const classified = incidents.map((incident) => {
        const classification = classifyIncident(incident);
        const weightedImpact = clamp(Math.round(
            incident.severity * 0.62
            + incident.recurrence * 12
            + classification.keywordHits * 8
        ));

        return {
            incidentId: incident.incidentId,
            summary: incident.summary,
            phase: incident.phase,
            severity: incident.severity,
            recurrence: incident.recurrence,
            taxonomyCode: classification.taxonomyCode,
            keywordHits: classification.keywordHits,
            weightedImpact
        };
    });

    const buckets = new Map();
    for (const entry of classified) {
        const bucket = buckets.get(entry.taxonomyCode) || {
            taxonomyCode: entry.taxonomyCode,
            incidentCount: 0,
            totalImpact: 0,
            maxSeverity: 0,
            recurrenceLoad: 0
        };

        bucket.incidentCount += 1;
        bucket.totalImpact += entry.weightedImpact;
        bucket.maxSeverity = Math.max(bucket.maxSeverity, entry.severity);
        bucket.recurrenceLoad += entry.recurrence;

        buckets.set(entry.taxonomyCode, bucket);
    }

    const taxonomy = Array.from(buckets.values())
        .map((bucket) => ({
            ...bucket,
            avgImpact: Number((bucket.totalImpact / bucket.incidentCount).toFixed(2)),
            pressureScore: clamp(Math.round(
                bucket.totalImpact * 0.2
                + bucket.recurrenceLoad * 6
                + bucket.maxSeverity * 0.28
            ))
        }))
        .sort((a, b) => b.pressureScore - a.pressureScore);

    return {
        classified,
        taxonomy
    };
}

function summarizeTaxonomy(result) {
    const top = result.taxonomy[0] || null;
    const recurringCriticalCount = result.classified.filter((entry) => entry.recurrence >= 2 && entry.severity >= 70).length;

    let posture = 'learning';
    if (top && (top.pressureScore >= 80 || recurringCriticalCount > 0)) posture = 'critical';
    else if (top && top.pressureScore >= 58) posture = 'watch';

    return {
        incidentCount: result.classified.length,
        taxonomyCount: result.taxonomy.length,
        topTaxonomyCode: top?.taxonomyCode || null,
        topPressureScore: top?.pressureScore || 0,
        recurringCriticalCount,
        posture
    };
}

function buildAlerts(summary) {
    const alerts = [];
    if (summary.topPressureScore >= 70) alerts.push('taxonomy_pressure_high');
    if (summary.recurringCriticalCount > 0) alerts.push('taxonomy_recurring_critical_errors');
    if (summary.taxonomyCount <= 1 && summary.incidentCount >= 3) alerts.push('taxonomy_diversity_low');
    return alerts;
}

function buildRecommendations(result, summary, alerts) {
    const recommendations = [];

    for (const bucket of result.taxonomy.slice(0, 3)) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'run_error_taxonomy_review',
            taxonomyCode: bucket.taxonomyCode,
            title: `Run taxonomy review for ${bucket.taxonomyCode}`,
            description: `Pressure score ${bucket.pressureScore} across ${bucket.incidentCount} incidents.`,
            priority: bucket.pressureScore >= 75 ? 'P1' : 'P2'
        });

        if (bucket.incidentCount >= 2 || bucket.recurrenceLoad >= 3) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'add_taxonomy_regression_guard',
                taxonomyCode: bucket.taxonomyCode,
                title: `Add regression guard for ${bucket.taxonomyCode}`,
                description: 'Convert recurring failure signature into automated guardrails/tests.',
                priority: bucket.maxSeverity >= 75 ? 'P1' : 'P2'
            });
        }
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_reflection_taxonomy_digest',
            title: 'Publish self-reflection taxonomy digest',
            description: 'Share recurring failure classes, severity, and owner actions.',
            priority: summary.posture === 'critical' ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.taxonomyCode || '').localeCompare(String(b.taxonomyCode || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type
            && String(other.taxonomyCode || '') === String(entry.taxonomyCode || '')
        )) === index);
}

export function classifyReflectionErrors(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const incidents = normalizeIncidents(inputPayload || {});
    const taxonomyResult = buildTaxonomy(incidents);
    const summary = summarizeTaxonomy(taxonomyResult);
    const alerts = buildAlerts(summary);
    const recommendations = buildRecommendations(taxonomyResult, summary, alerts);

    return {
        at,
        summary,
        classifiedIncidents: taxonomyResult.classified,
        taxonomy: taxonomyResult.taxonomy,
        alerts,
        recommendations
    };
}

export function reflectionErrorsToTasks(reportPayload, {
    fromAgentId = 'agent:self-reflection',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('reflectionErrorsToTasks requires report payload');
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
            taxonomyCode: recommendation.taxonomyCode || null,
            posture: reportPayload.summary?.posture || null
        },
        createdAt: nowMs + index
    }));
}

export class SelfReflectionErrorTaxonomy {
    constructor({
        localAgentId = 'agent:self-reflection',
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
        const report = classifyReflectionErrors(inputPayload, {
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
        return reflectionErrorsToTasks(reportPayload, {
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

export const __selfReflectionErrorTaxonomyInternals = {
    normalizeIncidents,
    classifyIncident,
    buildTaxonomy,
    summarizeTaxonomy,
    buildRecommendations
};
