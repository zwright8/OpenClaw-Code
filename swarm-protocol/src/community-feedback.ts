import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    investigate_theme: 'agent:research',
    mitigate_harm_signal: 'agent:safety',
    amplify_positive_pattern: 'agent:community',
    publish_response_update: 'agent:ops'
};

const RecommendationPriorityTaskMap = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
};

const PositiveKeywords = [
    'helpful',
    'useful',
    'improved',
    'better',
    'faster',
    'supportive',
    'clear',
    'effective'
];

const NegativeKeywords = [
    'broken',
    'failed',
    'harm',
    'unsafe',
    'confusing',
    'slow',
    'frustrating',
    'inaccurate',
    'biased'
];

const UrgencyKeywords = [
    'urgent',
    'immediately',
    'asap',
    'critical',
    'emergency',
    'severe'
];

const HarmKeywords = [
    'harm',
    'unsafe',
    'danger',
    'abuse',
    'scam',
    'self-harm',
    'violence'
];

const ThemeKeywords = {
    safety: ['safe', 'unsafe', 'harm', 'risk', 'danger', 'abuse'],
    accessibility: ['accessibility', 'screen reader', 'caption', 'keyboard', 'disability', 'accessible'],
    reliability: ['crash', 'timeout', 'failed', 'broken', 'unavailable', 'latency'],
    fairness: ['bias', 'unfair', 'discrimination', 'equity', 'inclusive'],
    trust: ['trust', 'misleading', 'transparent', 'honest', 'fraud'],
    usability: ['confusing', 'ui', 'ux', 'workflow', 'navigation', 'friction'],
    privacy: ['privacy', 'leak', 'data', 'consent', 'tracking'],
    cost: ['expensive', 'cost', 'budget', 'pricing', 'fee']
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

function normalizeFeedbackItems(inputPayload) {
    const entries = Array.isArray(inputPayload?.feedback)
        ? inputPayload.feedback
        : [];

    return entries.map((entry, index) => {
        const text = typeof entry?.text === 'string' ? entry.text.trim() : '';
        return {
            id: typeof entry?.id === 'string' && entry.id.trim()
                ? entry.id.trim()
                : `feedback-${index + 1}`,
            channel: typeof entry?.channel === 'string' && entry.channel.trim()
                ? entry.channel.trim().toLowerCase()
                : 'unknown',
            authorType: typeof entry?.authorType === 'string' && entry.authorType.trim()
                ? entry.authorType.trim().toLowerCase()
                : 'user',
            region: typeof entry?.region === 'string' && entry.region.trim()
                ? entry.region.trim()
                : 'global',
            text,
            timestamp: Number.isFinite(Number(entry?.timestamp))
                ? Number(entry.timestamp)
                : Date.now(),
            upvotes: Math.max(0, Math.floor(safeNumber(entry?.upvotes, 0))),
            flags: Array.isArray(entry?.flags)
                ? entry.flags.filter((flag) => typeof flag === 'string')
                : []
        };
    }).filter((entry) => entry.text.length > 0);
}

function normalizeText(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function textFingerprint(text) {
    const normalized = normalizeText(text);
    if (!normalized) return '';
    const tokens = normalized.split(' ').filter((token) => token.length > 2);
    return tokens.slice(0, 16).join(' ');
}

function classifySentiment(text) {
    const normalized = normalizeText(text);
    const positive = PositiveKeywords.filter((keyword) => normalized.includes(keyword)).length;
    const negative = NegativeKeywords.filter((keyword) => normalized.includes(keyword)).length;
    const score = clamp(50 + positive * 12 - negative * 15, 0, 100);
    const label = score >= 65 ? 'positive' : (score <= 35 ? 'negative' : 'mixed');
    return {
        score,
        label,
        positiveHits: positive,
        negativeHits: negative
    };
}

function classifyUrgency(text, flags) {
    const normalized = normalizeText(text);
    const keywordHits = UrgencyKeywords.filter((keyword) => normalized.includes(keyword)).length;
    const flagBoost = Array.isArray(flags) && flags.includes('urgent') ? 20 : 0;
    return clamp(keywordHits * 22 + flagBoost, 0, 100);
}

function classifyHarmRisk(text, flags) {
    const normalized = normalizeText(text);
    const keywordHits = HarmKeywords.filter((keyword) => normalized.includes(keyword)).length;
    const flagBoost = Array.isArray(flags) && flags.some((flag) => ['safety', 'harm', 'abuse'].includes(flag))
        ? 30
        : 0;
    return clamp(keywordHits * 25 + flagBoost, 0, 100);
}

function detectThemes(text) {
    const normalized = normalizeText(text);
    const themes = [];
    for (const [theme, keywords] of Object.entries(ThemeKeywords)) {
        if (keywords.some((keyword) => normalized.includes(keyword))) {
            themes.push(theme);
        }
    }
    return themes.length > 0 ? themes : ['general'];
}

function enrichFeedback(items) {
    return items.map((item) => {
        const sentiment = classifySentiment(item.text);
        const urgencyScore = classifyUrgency(item.text, item.flags);
        const harmRiskScore = classifyHarmRisk(item.text, item.flags);
        const themes = detectThemes(item.text);
        const priorityScore = clamp(
            (100 - sentiment.score) * 0.45
            + urgencyScore * 0.3
            + harmRiskScore * 0.2
            + Math.min(25, item.upvotes * 2) * 0.05
        );

        return {
            ...item,
            sentiment,
            urgencyScore: Number(urgencyScore.toFixed(2)),
            harmRiskScore: Number(harmRiskScore.toFixed(2)),
            priorityScore: Number(priorityScore.toFixed(2)),
            themes
        };
    }).sort((a, b) => b.priorityScore - a.priorityScore);
}

function deduplicateFeedback(items) {
    const seen = new Set();
    const unique = [];
    const duplicates = [];

    for (const item of items) {
        const fingerprint = textFingerprint(item.text);
        const key = `${item.channel}:${fingerprint}`;
        if (seen.has(key)) {
            duplicates.push({
                id: item.id,
                duplicateOfKey: key
            });
            continue;
        }
        seen.add(key);
        unique.push({
            ...item,
            fingerprint
        });
    }

    return {
        unique,
        duplicates
    };
}

function aggregateThemes(items) {
    const map = new Map();

    for (const item of items) {
        for (const theme of item.themes) {
            if (!map.has(theme)) {
                map.set(theme, {
                    theme,
                    count: 0,
                    avgPriorityScore: 0,
                    avgSentimentScore: 0,
                    urgentCount: 0,
                    highRiskCount: 0,
                    regions: new Set(),
                    sampleFeedbackIds: []
                });
            }
            const entry = map.get(theme);
            entry.count++;
            entry.avgPriorityScore += item.priorityScore;
            entry.avgSentimentScore += item.sentiment.score;
            if (item.urgencyScore >= 60) entry.urgentCount++;
            if (item.harmRiskScore >= 60) entry.highRiskCount++;
            entry.regions.add(item.region);
            if (entry.sampleFeedbackIds.length < 5) {
                entry.sampleFeedbackIds.push(item.id);
            }
        }
    }

    return [...map.values()]
        .map((entry) => ({
            theme: entry.theme,
            count: entry.count,
            avgPriorityScore: Number((entry.avgPriorityScore / entry.count).toFixed(2)),
            avgSentimentScore: Number((entry.avgSentimentScore / entry.count).toFixed(2)),
            urgentCount: entry.urgentCount,
            highRiskCount: entry.highRiskCount,
            regions: [...entry.regions].sort(),
            sampleFeedbackIds: entry.sampleFeedbackIds
        }))
        .sort((a, b) => {
            if (b.avgPriorityScore !== a.avgPriorityScore) {
                return b.avgPriorityScore - a.avgPriorityScore;
            }
            if (b.highRiskCount !== a.highRiskCount) {
                return b.highRiskCount - a.highRiskCount;
            }
            return String(a.theme).localeCompare(String(b.theme));
        });
}

function postureFromSummary(summary) {
    if (summary.highRiskCount >= 2 || summary.avgPriorityScore >= 75) {
        return 'critical';
    }
    if (summary.highRiskCount >= 1 || summary.urgentCount >= 2 || summary.avgPriorityScore >= 58) {
        return 'attention';
    }
    return 'stable';
}

function buildRecommendations({
    posture,
    themeSummaries,
    summary
}) {
    const recommendations = [];
    const topTheme = themeSummaries[0] || null;

    if (topTheme && (topTheme.avgPriorityScore >= 60 || topTheme.highRiskCount > 0)) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: topTheme.highRiskCount > 0 ? 'mitigate_harm_signal' : 'investigate_theme',
            title: `Investigate community theme: ${topTheme.theme}`,
            description: `Top concern has priority ${topTheme.avgPriorityScore} across ${topTheme.count} reports.`,
            priority: topTheme.highRiskCount > 0 ? 'P0' : 'P1'
        });
    }

    if (summary.positiveCount > 0 && summary.negativeCount === 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'amplify_positive_pattern',
            title: 'Amplify positive community feedback patterns',
            description: 'Feedback trend is consistently positive; reinforce what is working.',
            priority: 'P3'
        });
    }

    if (posture !== 'stable') {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_response_update',
            title: 'Publish transparent community response update',
            description: `Current feedback posture is ${posture}; publish status and mitigation plan.`,
            priority: posture === 'critical' ? 'P1' : 'P2'
        });
    }

    if (themeSummaries.some((theme) => theme.highRiskCount > 0)) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'mitigate_harm_signal',
            title: 'Mitigate high-risk harm signals from community feedback',
            description: 'One or more themes include clear harm-risk indicators requiring safeguards.',
            priority: 'P0'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.type).localeCompare(String(b.type));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => other.type === entry.type) === index);
}

export function harvestCommunityFeedback(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const normalized = normalizeFeedbackItems(inputPayload || {});
    const enriched = enrichFeedback(normalized);
    const { unique, duplicates } = deduplicateFeedback(enriched);
    const themeSummaries = aggregateThemes(unique);

    const positiveCount = unique.filter((item) => item.sentiment.label === 'positive').length;
    const negativeCount = unique.filter((item) => item.sentiment.label === 'negative').length;
    const mixedCount = unique.length - positiveCount - negativeCount;
    const urgentCount = unique.filter((item) => item.urgencyScore >= 60).length;
    const highRiskCount = unique.filter((item) => item.harmRiskScore >= 60).length;
    const avgPriorityScore = unique.length > 0
        ? Number((unique.reduce((acc, item) => acc + item.priorityScore, 0) / unique.length).toFixed(2))
        : 0;
    const posture = postureFromSummary({
        urgentCount,
        highRiskCount,
        avgPriorityScore
    });

    const summary = {
        totalFeedbackCount: normalized.length,
        uniqueFeedbackCount: unique.length,
        duplicateCount: duplicates.length,
        positiveCount,
        negativeCount,
        mixedCount,
        urgentCount,
        highRiskCount,
        avgPriorityScore,
        posture
    };
    const recommendations = buildRecommendations({
        posture,
        themeSummaries,
        summary
    });

    const alerts = [];
    if (summary.duplicateCount > 0) alerts.push('duplicate_feedback_detected');
    if (summary.urgentCount > 0) alerts.push('urgent_feedback_detected');
    if (summary.highRiskCount > 0) alerts.push('harm_signal_detected');
    if (summary.posture === 'critical') alerts.push('community_posture_critical');

    return {
        at,
        feedback: unique.map((item) => clone(item)),
        duplicates,
        themes: themeSummaries,
        summary,
        alerts,
        recommendations
    };
}

export function communityFeedbackToTasks(reportPayload, {
    fromAgentId = 'agent:community-feedback',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('communityFeedbackToTasks requires report payload');
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
            posture: reportPayload.summary?.posture || 'stable',
            highRiskCount: reportPayload.summary?.highRiskCount ?? 0,
            urgentCount: reportPayload.summary?.urgentCount ?? 0
        },
        createdAt: nowMs + index
    }));
}

export class CommunityFeedbackHarvester {
    constructor({
        localAgentId = 'agent:community-feedback',
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
        const report = harvestCommunityFeedback(inputPayload, {
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
        return communityFeedbackToTasks(reportPayload, {
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

export const __communityFeedbackInternals = {
    normalizeFeedbackItems,
    classifySentiment,
    classifyUrgency,
    classifyHarmRisk,
    detectThemes,
    deduplicateFeedback,
    aggregateThemes,
    postureFromSummary,
    buildRecommendations
};
