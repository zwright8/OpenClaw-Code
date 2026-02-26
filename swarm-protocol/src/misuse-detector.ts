import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    restrict_actor: 'agent:safety',
    open_misuse_investigation: 'agent:review',
    strengthen_detection_rule: 'agent:analysis',
    publish_abuse_advisory: 'agent:ops'
};

const RecommendationPriorityTaskMap = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
};

const SignatureLibrary = {
    jailbreak_probe: [
        'bypass safety',
        'ignore previous instructions',
        'jailbreak',
        'developer mode',
        'disable guardrails'
    ],
    scam_pattern: [
        'wire transfer',
        'send gift card',
        'crypto wallet',
        'urgent payment',
        'bank verification code'
    ],
    data_exfiltration: [
        'dump database',
        'extract secrets',
        'api key',
        'password list',
        'private records'
    ],
    harassment_pattern: [
        'harass',
        'threaten',
        'abuse',
        'dox',
        'violent message'
    ],
    fraud_pattern: [
        'fake identity',
        'impersonate',
        'forged document',
        'counterfeit',
        'fake invoice'
    ]
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

function normalizeText(value) {
    if (typeof value !== 'string') return '';
    return value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizeEvents(inputPayload) {
    const entries = Array.isArray(inputPayload?.events)
        ? inputPayload.events
        : [];

    return entries.map((entry, index) => {
        const prompt = typeof entry?.prompt === 'string'
            ? entry.prompt
            : (typeof entry?.action === 'string' ? entry.action : '');
        const context = typeof entry?.context === 'string' ? entry.context : '';
        const signalTokens = Array.isArray(entry?.signals)
            ? entry.signals.filter((signal) => typeof signal === 'string')
            : [];
        const combinedText = `${prompt} ${context} ${signalTokens.join(' ')}`.trim();

        return {
            id: typeof entry?.id === 'string' && entry.id.trim()
                ? entry.id.trim()
                : `event-${index + 1}`,
            actorId: typeof entry?.actorId === 'string' && entry.actorId.trim()
                ? entry.actorId.trim()
                : 'actor:unknown',
            channel: typeof entry?.channel === 'string' && entry.channel.trim()
                ? entry.channel.trim().toLowerCase()
                : 'unknown',
            timestamp: Number.isFinite(Number(entry?.timestamp))
                ? Number(entry.timestamp)
                : Date.now(),
            blocked: Boolean(entry?.blocked),
            severityHint: clamp(safeNumber(entry?.severityHint, 30)),
            text: combinedText,
            normalizedText: normalizeText(combinedText)
        };
    });
}

function detectEventSignatures(event) {
    const hits = [];
    for (const [signatureType, keywords] of Object.entries(SignatureLibrary)) {
        const matched = keywords.filter((keyword) => event.normalizedText.includes(keyword));
        if (matched.length === 0) continue;
        hits.push({
            signatureType,
            keywordHits: matched,
            confidence: clamp(40 + matched.length * 15 + (event.blocked ? 12 : 0))
        });
    }
    return hits;
}

function detectPatterns(events) {
    const patterns = [];
    const byTypeActor = new Map();

    for (const event of events) {
        const hits = detectEventSignatures(event);
        for (const hit of hits) {
            const key = `${hit.signatureType}:${event.actorId}`;
            if (!byTypeActor.has(key)) {
                byTypeActor.set(key, {
                    signatureType: hit.signatureType,
                    actorId: event.actorId,
                    count: 0,
                    blockedCount: 0,
                    confidenceSum: 0,
                    evidenceEventIds: []
                });
            }
            const bucket = byTypeActor.get(key);
            bucket.count++;
            if (event.blocked) bucket.blockedCount++;
            bucket.confidenceSum += hit.confidence;
            if (bucket.evidenceEventIds.length < 10) {
                bucket.evidenceEventIds.push(event.id);
            }
        }
    }

    for (const bucket of byTypeActor.values()) {
        const avgConfidence = bucket.count > 0
            ? bucket.confidenceSum / bucket.count
            : 0;
        const severityScore = clamp(Math.round(
            avgConfidence * 0.5
            + bucket.count * 10
            + bucket.blockedCount * 7
        ));
        patterns.push({
            id: `pattern-${randomUUID().slice(0, 8)}`,
            signatureType: bucket.signatureType,
            actorId: bucket.actorId,
            count: bucket.count,
            blockedCount: bucket.blockedCount,
            confidence: Number(avgConfidence.toFixed(2)),
            severityScore,
            evidenceEventIds: bucket.evidenceEventIds
        });
    }

    return patterns.sort((a, b) => {
        if (b.severityScore !== a.severityScore) return b.severityScore - a.severityScore;
        if (b.count !== a.count) return b.count - a.count;
        return String(a.actorId).localeCompare(String(b.actorId));
    });
}

function summarizeActors(events, patterns) {
    const eventsByActor = new Map();
    for (const event of events) {
        if (!eventsByActor.has(event.actorId)) {
            eventsByActor.set(event.actorId, {
                actorId: event.actorId,
                eventCount: 0,
                blockedCount: 0,
                avgSeverityHint: 0
            });
        }
        const entry = eventsByActor.get(event.actorId);
        entry.eventCount++;
        if (event.blocked) entry.blockedCount++;
        entry.avgSeverityHint += event.severityHint;
    }

    const actorPatternMap = new Map();
    for (const pattern of patterns) {
        if (!actorPatternMap.has(pattern.actorId)) {
            actorPatternMap.set(pattern.actorId, []);
        }
        actorPatternMap.get(pattern.actorId).push(pattern);
    }

    const actors = [];
    for (const [actorId, base] of eventsByActor.entries()) {
        const actorPatterns = actorPatternMap.get(actorId) || [];
        const patternSeverity = actorPatterns.reduce((acc, pattern) => acc + pattern.severityScore, 0);
        const avgSeverityHint = base.eventCount > 0
            ? base.avgSeverityHint / base.eventCount
            : 0;
        const burstFactor = base.eventCount >= 8 ? 14 : (base.eventCount >= 5 ? 8 : 0);

        const riskScore = clamp(Math.round(
            avgSeverityHint * 0.28
            + (base.blockedCount * 12)
            + (patternSeverity * 0.55)
            + burstFactor
        ));

        actors.push({
            actorId,
            eventCount: base.eventCount,
            blockedCount: base.blockedCount,
            patternCount: actorPatterns.length,
            topSignatures: actorPatterns.slice(0, 3).map((pattern) => pattern.signatureType),
            riskScore
        });
    }

    return actors.sort((a, b) => {
        if (b.riskScore !== a.riskScore) return b.riskScore - a.riskScore;
        if (b.eventCount !== a.eventCount) return b.eventCount - a.eventCount;
        return String(a.actorId).localeCompare(String(b.actorId));
    });
}

function threatLevelFromActors(actors, patterns) {
    const highestActorRisk = actors.length > 0 ? actors[0].riskScore : 0;
    const highestPatternSeverity = patterns.length > 0 ? patterns[0].severityScore : 0;
    const highRiskActorCount = actors.filter((actor) => actor.riskScore >= 70).length;

    const blended = Math.round(
        highestActorRisk * 0.58
        + highestPatternSeverity * 0.32
        + Math.min(20, highRiskActorCount * 6)
    );

    if (blended >= 85) return 'critical';
    if (blended >= 68) return 'high';
    if (blended >= 45) return 'elevated';
    if (blended >= 25) return 'guarded';
    return 'low';
}

function buildAlerts(threatLevel, actors, patterns) {
    const alerts = [];
    if (threatLevel === 'high' || threatLevel === 'critical') {
        alerts.push('misuse_threat_high');
    }
    if (actors.some((actor) => actor.riskScore >= 80)) {
        alerts.push('high_risk_actor_detected');
    }
    if (patterns.some((pattern) => ['jailbreak_probe', 'data_exfiltration'].includes(pattern.signatureType) && pattern.severityScore >= 65)) {
        alerts.push('critical_signature_detected');
    }
    if (patterns.some((pattern) => pattern.count >= 3)) {
        alerts.push('repeated_misuse_pattern');
    }
    return alerts;
}

function buildRecommendations({
    threatLevel,
    actors,
    patterns,
    alerts
}) {
    const recommendations = [];
    const highRiskActors = actors.filter((actor) => actor.riskScore >= 70).slice(0, 4);
    for (const actor of highRiskActors) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'restrict_actor',
            actorId: actor.actorId,
            title: `Restrict high-risk actor ${actor.actorId}`,
            description: `Actor risk score ${actor.riskScore} with ${actor.patternCount} misuse patterns.`,
            priority: actor.riskScore >= 85 ? 'P0' : 'P1'
        });
    }

    if (threatLevel === 'high' || threatLevel === 'critical') {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'open_misuse_investigation',
            title: 'Open cross-team misuse investigation',
            description: `Current misuse threat level is ${threatLevel}; immediate investigation required.`,
            priority: threatLevel === 'critical' ? 'P0' : 'P1'
        });
    }

    const frequentPatterns = patterns.filter((pattern) => pattern.count >= 2).slice(0, 3);
    for (const pattern of frequentPatterns) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'strengthen_detection_rule',
            signatureType: pattern.signatureType,
            title: `Strengthen detection rule for ${pattern.signatureType}`,
            description: `Pattern repeated ${pattern.count} times with severity ${pattern.severityScore}.`,
            priority: pattern.severityScore >= 75 ? 'P1' : 'P2'
        });
    }

    if (alerts.includes('repeated_misuse_pattern') || alerts.includes('critical_signature_detected')) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_abuse_advisory',
            title: 'Publish internal abuse advisory update',
            description: 'Communicate active misuse signatures and mitigations to operations teams.',
            priority: threatLevel === 'critical' ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.type).localeCompare(String(b.type));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type
            && String(other.actorId || '') === String(entry.actorId || '')
            && String(other.signatureType || '') === String(entry.signatureType || '')
        )) === index);
}

export function detectMisuseBehaviors(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const events = normalizeEvents(inputPayload || {});
    const patterns = detectPatterns(events);
    const actors = summarizeActors(events, patterns);
    const threatLevel = threatLevelFromActors(actors, patterns);
    const alerts = buildAlerts(threatLevel, actors, patterns);
    const recommendations = buildRecommendations({
        threatLevel,
        actors,
        patterns,
        alerts
    });

    return {
        at,
        events: events.map((event) => clone(event)),
        patterns: patterns.map((pattern) => clone(pattern)),
        actors: actors.map((actor) => clone(actor)),
        summary: {
            eventCount: events.length,
            actorCount: actors.length,
            patternCount: patterns.length,
            highRiskActorCount: actors.filter((actor) => actor.riskScore >= 70).length,
            threatLevel
        },
        alerts,
        recommendations
    };
}

export function misuseRecommendationsToTasks(reportPayload, {
    fromAgentId = 'agent:misuse-detector',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('misuseRecommendationsToTasks requires report payload');
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
            threatLevel: reportPayload.summary?.threatLevel || 'low',
            actorId: recommendation.actorId || null,
            signatureType: recommendation.signatureType || null
        },
        createdAt: nowMs + index
    }));
}

export class MisuseBehaviorDetector {
    constructor({
        localAgentId = 'agent:misuse-detector',
        now = Date.now,
        maxHistory = 150
    } = {}) {
        this.localAgentId = localAgentId;
        this.now = typeof now === 'function' ? now : Date.now;
        this.maxHistory = Number.isInteger(maxHistory) && maxHistory > 0
            ? maxHistory
            : 150;
        this.history = [];
    }

    evaluate(inputPayload, options = {}) {
        const report = detectMisuseBehaviors(inputPayload, {
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
        return misuseRecommendationsToTasks(reportPayload, {
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

export const __misuseDetectorInternals = {
    normalizeEvents,
    detectEventSignatures,
    detectPatterns,
    summarizeActors,
    threatLevelFromActors,
    buildAlerts,
    buildRecommendations
};
