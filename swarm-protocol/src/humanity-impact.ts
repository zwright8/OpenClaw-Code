import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const DefaultBenefitKeywords = [
    'reliability',
    'recovery',
    'safety',
    'accessibility',
    'health',
    'education',
    'resilience',
    'humanitarian',
    'compliance',
    'incident response'
];

const DefaultHarmKeywords = [
    'malware',
    'phishing',
    'exploit',
    'credential theft',
    'privacy violation',
    'surveillance abuse',
    'weapon',
    'deception',
    'ransomware',
    'social engineering'
];

const DefaultHardBlockKeywords = [
    'malware',
    'credential theft',
    'weapon'
];

const RecommendationTargetMap = {
    redesign_for_human_safety: 'agent:safety',
    add_humanity_safeguards: 'agent:review',
    document_human_benefit: 'agent:analysis'
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

function normalizeStringList(value, { lower = false } = {}) {
    if (!Array.isArray(value)) return [];
    return [...new Set(value
        .filter((item) => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => (lower ? item.toLowerCase() : item))
    )];
}

function normalizeItems(inputPayload) {
    const tasks = Array.isArray(inputPayload?.tasks)
        ? inputPayload.tasks
        : (Array.isArray(inputPayload?.taskRequests) ? inputPayload.taskRequests : []);
    const missions = Array.isArray(inputPayload?.missions)
        ? inputPayload.missions
        : [];
    const launches = Array.isArray(inputPayload?.launchBatch?.launches)
        ? inputPayload.launchBatch.launches
        : [];

    const items = [];

    for (const task of tasks) {
        if (!task || typeof task !== 'object') continue;
        items.push({
            id: task.id || task.taskId || randomUUID(),
            source: 'task',
            text: task.task || '',
            riskTags: normalizeStringList(task?.context?.riskTags, { lower: true }),
            requiredCapabilities: normalizeStringList(task?.context?.requiredCapabilities, { lower: true }),
            raw: clone(task)
        });
    }

    for (const mission of missions) {
        if (!mission || typeof mission !== 'object') continue;
        items.push({
            id: mission.missionId || randomUUID(),
            source: 'mission',
            text: mission.objective || '',
            riskTags: normalizeStringList(mission.riskTags, { lower: true }),
            requiredCapabilities: normalizeStringList(mission.requiredCapabilities, { lower: true }),
            raw: clone(mission)
        });
    }

    for (const launch of launches) {
        if (!launch || typeof launch !== 'object') continue;
        const text = launch?.objective || launch?.taskRequest?.task || '';
        const riskTags = normalizeStringList(
            launch?.taskRequest?.context?.riskTags || launch?.riskTags,
            { lower: true }
        );
        const requiredCapabilities = normalizeStringList(
            launch?.taskRequest?.context?.requiredCapabilities || launch?.requiredCapabilities,
            { lower: true }
        );
        items.push({
            id: launch.missionId || launch?.taskRequest?.id || randomUUID(),
            source: 'launch',
            text,
            riskTags,
            requiredCapabilities,
            raw: clone(launch)
        });
    }

    return items;
}

function matchKeywords(text, keywords) {
    const normalized = String(text || '').toLowerCase();
    const matches = [];
    for (const keyword of keywords) {
        if (normalized.includes(keyword)) {
            matches.push(keyword);
        }
    }
    return matches;
}

function classifyImpact({
    benefitScore,
    harmScore,
    hardBlockMatched,
    netImpact
}) {
    if (hardBlockMatched || harmScore >= 65) {
        return 'blocked';
    }

    if (harmScore >= 35 || netImpact < 10) {
        return 'review_required';
    }

    return 'aligned';
}

function recommendationPriority(classification, benefitScore) {
    if (classification === 'blocked') return 'P1';
    if (classification === 'review_required') return 'P2';
    if (benefitScore < 20) return 'P3';
    return null;
}

function buildRecommendations(assessments) {
    const recommendations = [];
    for (const item of assessments) {
        const priority = recommendationPriority(item.classification, item.benefitScore);
        if (!priority) continue;

        if (item.classification === 'blocked') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'redesign_for_human_safety',
                itemId: item.id,
                title: `Redesign blocked item ${item.id} for human safety`,
                description: `Hard harm signals detected: ${item.harmSignals.join(', ') || 'unspecified'}.`,
                priority
            });
            continue;
        }

        if (item.classification === 'review_required') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'add_humanity_safeguards',
                itemId: item.id,
                title: `Add safeguards for ${item.id}`,
                description: `Human-impact review required (benefit ${item.benefitScore}, harm ${item.harmScore}).`,
                priority
            });
            continue;
        }

        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'document_human_benefit',
            itemId: item.id,
            title: `Document explicit human benefit for ${item.id}`,
            description: 'Item is allowed but lacks explicit positive human-impact evidence.',
            priority
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations.sort((a, b) => {
        const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
        if (p !== 0) return p;
        return String(a.itemId).localeCompare(String(b.itemId));
    });
}

export function evaluateHumanityImpact(inputPayload, {
    now = Date.now,
    benefitKeywords = DefaultBenefitKeywords,
    harmKeywords = DefaultHarmKeywords,
    hardBlockKeywords = DefaultHardBlockKeywords
} = {}) {
    const at = safeNow(now);
    const items = normalizeItems(inputPayload || {});
    const benefit = normalizeStringList(benefitKeywords, { lower: true });
    const harm = normalizeStringList(harmKeywords, { lower: true });
    const hardBlock = normalizeStringList(hardBlockKeywords, { lower: true });

    const assessments = items.map((item) => {
        const text = [
            item.text || '',
            item.riskTags.join(' '),
            item.requiredCapabilities.join(' ')
        ].join(' ').toLowerCase();

        const benefitSignals = matchKeywords(text, benefit);
        const harmSignals = matchKeywords(text, harm);
        const hardBlockSignals = harmSignals.filter((signal) => hardBlock.includes(signal));

        const benefitScore = Math.min(100, benefitSignals.length * 20);
        const harmScore = Math.min(
            100,
            harmSignals.length * 24 + (item.riskTags.includes('security') ? 8 : 0)
        );
        const netImpact = benefitScore - harmScore;
        const classification = classifyImpact({
            benefitScore,
            harmScore,
            hardBlockMatched: hardBlockSignals.length > 0,
            netImpact
        });

        return {
            id: item.id,
            source: item.source,
            benefitSignals,
            harmSignals,
            hardBlockSignals,
            benefitScore,
            harmScore,
            netImpact,
            classification
        };
    });

    const recommendations = buildRecommendations(assessments);
    const summary = {
        itemCount: assessments.length,
        alignedCount: assessments.filter((item) => item.classification === 'aligned').length,
        reviewRequiredCount: assessments.filter((item) => item.classification === 'review_required').length,
        blockedCount: assessments.filter((item) => item.classification === 'blocked').length,
        avgBenefitScore: assessments.length > 0
            ? Number((assessments.reduce((acc, item) => acc + item.benefitScore, 0) / assessments.length).toFixed(2))
            : 0,
        avgHarmScore: assessments.length > 0
            ? Number((assessments.reduce((acc, item) => acc + item.harmScore, 0) / assessments.length).toFixed(2))
            : 0
    };

    let posture = 'aligned';
    if (summary.blockedCount > 0) {
        posture = 'blocked';
    } else if (summary.reviewRequiredCount > 0) {
        posture = 'review_required';
    }

    return {
        at,
        posture,
        summary,
        assessments,
        recommendations
    };
}

export function humanityRecommendationsToTasks(reportPayload, {
    fromAgentId = 'agent:humanity-guardrail',
    defaultTarget = 'agent:review',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('humanityRecommendationsToTasks requires report payload');
    }

    const recommendations = Array.isArray(reportPayload.recommendations)
        ? reportPayload.recommendations
        : [];
    const nowMs = safeNow(Date.now);
    const targets = {
        ...RecommendationTargetMap,
        ...(targetMap || {})
    };

    return recommendations.map((recommendation, index) => buildTaskRequest({
        id: randomUUID(),
        from: fromAgentId,
        target: targets[recommendation.type] || defaultTarget,
        priority: RecommendationPriorityTaskMap[recommendation.priority] || 'normal',
        task: `[${recommendation.priority}] ${recommendation.title}`,
        context: {
            recommendationType: recommendation.type,
            itemId: recommendation.itemId,
            description: recommendation.description
        },
        createdAt: nowMs + index
    }));
}

export class HumanityImpactGuardrail {
    constructor({
        localAgentId = 'agent:humanity-guardrail',
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

    evaluate(inputPayload, options = {}) {
        const report = evaluateHumanityImpact(inputPayload, {
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
        return humanityRecommendationsToTasks(reportPayload, {
            fromAgentId: this.localAgentId,
            ...options
        });
    }

    listHistory({ limit = 30 } = {}) {
        return this.history
            .slice(-Math.max(1, Number(limit) || 30))
            .map((entry) => clone(entry));
    }
}

export const __humanityImpactInternals = {
    normalizeItems,
    classifyImpact,
    buildRecommendations,
    matchKeywords
};
