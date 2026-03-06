import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const DefaultWeights = {
    truthSeeking: 0.4,
    proHumanity: 0.4,
    curiosity: 0.2
};

const DeceptionKeywords = [
    'deception',
    'manipulation',
    'mislead',
    'fake evidence',
    'fabricate',
    'fraud'
];

const RecommendationTargetMap = {
    strengthen_truth_process: 'agent:analysis',
    apply_humanity_safeguards: 'agent:safety',
    expand_curiosity_pipeline: 'agent:research',
    pause_autonomy: 'agent:ops'
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

function clamp100(value) {
    return Math.max(0, Math.min(100, value));
}

function normalizeWeights(weights) {
    const truthSeeking = safeNumber(weights?.truthSeeking, DefaultWeights.truthSeeking);
    const proHumanity = safeNumber(weights?.proHumanity, DefaultWeights.proHumanity);
    const curiosity = safeNumber(weights?.curiosity, DefaultWeights.curiosity);
    const sum = truthSeeking + proHumanity + curiosity;

    if (sum <= 0) {
        return { ...DefaultWeights };
    }

    return {
        truthSeeking: truthSeeking / sum,
        proHumanity: proHumanity / sum,
        curiosity: curiosity / sum
    };
}

function extractNarrativeText(inputPayload) {
    const segments = [];
    const tasks = Array.isArray(inputPayload?.tasks) ? inputPayload.tasks : [];
    for (const task of tasks) {
        if (typeof task?.task === 'string') segments.push(task.task);
    }

    const missions = Array.isArray(inputPayload?.missions) ? inputPayload.missions : [];
    for (const mission of missions) {
        if (typeof mission?.objective === 'string') segments.push(mission.objective);
    }

    const launches = Array.isArray(inputPayload?.launchBatch?.launches)
        ? inputPayload.launchBatch.launches
        : [];
    for (const launch of launches) {
        if (typeof launch?.objective === 'string') segments.push(launch.objective);
        if (typeof launch?.taskRequest?.task === 'string') segments.push(launch.taskRequest.task);
    }

    return segments.join(' ').toLowerCase();
}

function scoreTruthSeeking(inputPayload) {
    const truth = inputPayload?.truthReport || {};
    const evidenceCount = safeNumber(truth?.summary?.evidenceCount, 0);
    const hypothesisCount = safeNumber(truth?.summary?.hypothesisCount, 0);
    const uncertainCount = safeNumber(truth?.summary?.uncertainCount, 0);
    const avgConfidence = safeNumber(truth?.summary?.avgConfidence, 0);

    let score = 35;
    score += Math.min(30, evidenceCount * 2.5);
    score += Math.min(20, hypothesisCount * 3.5);
    score += Math.min(15, uncertainCount * 2.2);
    score += Math.min(12, avgConfidence * 10);

    const text = extractNarrativeText(inputPayload);
    const deceptionHits = DeceptionKeywords.filter((keyword) => text.includes(keyword));
    const deceptionPenalty = deceptionHits.length * 22;
    score -= deceptionPenalty;

    return {
        score: clamp100(Math.round(score)),
        evidenceCount,
        hypothesisCount,
        uncertainCount,
        avgConfidence,
        deceptionHits
    };
}

function scoreProHumanity(inputPayload) {
    const humanity = inputPayload?.humanityReport || {};
    const posture = humanity?.posture || 'aligned';
    const blockedCount = safeNumber(humanity?.summary?.blockedCount, 0);
    const reviewRequiredCount = safeNumber(humanity?.summary?.reviewRequiredCount, 0);
    const alignedCount = safeNumber(humanity?.summary?.alignedCount, 0);

    let score = 80;
    if (posture === 'blocked') score = 20;
    if (posture === 'review_required') score = 55;
    score += Math.min(12, alignedCount * 1.5);
    score -= Math.min(30, blockedCount * 14);
    score -= Math.min(18, reviewRequiredCount * 6);

    return {
        score: clamp100(Math.round(score)),
        posture,
        blockedCount,
        reviewRequiredCount,
        alignedCount
    };
}

function scoreCuriosity(inputPayload) {
    const agenda = inputPayload?.curiosityAgenda || {};
    const hypothesisCount = safeNumber(agenda?.summary?.hypothesisCount, 0);
    const nowCount = safeNumber(agenda?.summary?.nowCount, 0);
    const nextCount = safeNumber(agenda?.summary?.nextCount, 0);
    const avgCuriosityScore = safeNumber(agenda?.summary?.avgCuriosityScore, 0);

    let score = 25;
    score += Math.min(28, hypothesisCount * 3.2);
    score += Math.min(26, nowCount * 9);
    score += Math.min(12, nextCount * 3.5);
    score += Math.min(20, avgCuriosityScore * 0.2);

    return {
        score: clamp100(Math.round(score)),
        hypothesisCount,
        nowCount,
        nextCount,
        avgCuriosityScore
    };
}

function tierFromScores({
    overallScore,
    proHumanity,
    truthSeeking
}) {
    if (proHumanity.score < 40 || truthSeeking.score < 35) {
        return 'non_compliant';
    }
    if (overallScore >= 75) return 'aligned';
    if (overallScore >= 45) return 'caution';
    return 'non_compliant';
}

function buildRecommendations(metrics, tier) {
    const recommendations = [];

    if (metrics.truthSeeking.score < 70) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'strengthen_truth_process',
            title: 'Strengthen evidence and falsification pipeline',
            description: `Truth-seeking score is ${metrics.truthSeeking.score}; increase evidence quality and contradiction testing.`,
            priority: metrics.truthSeeking.score < 45 ? 'P1' : 'P2'
        });
    }

    if (metrics.proHumanity.score < 70) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'apply_humanity_safeguards',
            title: 'Apply additional human-safety safeguards',
            description: `Pro-humanity score is ${metrics.proHumanity.score}; reduce harm exposure before execution.`,
            priority: metrics.proHumanity.score < 45 ? 'P1' : 'P2'
        });
    }

    if (metrics.curiosity.score < 60) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'expand_curiosity_pipeline',
            title: 'Expand hypothesis and experiment agenda',
            description: `Curiosity score is ${metrics.curiosity.score}; increase exploration depth.`,
            priority: 'P2'
        });
    }

    if (tier === 'non_compliant') {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'pause_autonomy',
            title: 'Pause autonomous execution until constitution alignment recovers',
            description: 'Constitution alignment is non-compliant and requires remediation.',
            priority: 'P1'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations.sort((a, b) => {
        const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
        if (p !== 0) return p;
        return String(a.type).localeCompare(String(b.type));
    });
}

function buildBlockingReasons(metrics, tier) {
    const reasons = [];
    if (metrics.proHumanity.score < 40) {
        reasons.push('pro_humanity_low');
    }
    if (metrics.truthSeeking.deceptionHits.length > 0) {
        reasons.push('deception_signals_detected');
    }
    if (metrics.truthSeeking.score < 35) {
        reasons.push('truth_seeking_low');
    }
    if (tier === 'non_compliant' && reasons.length === 0) {
        reasons.push('overall_non_compliant');
    }
    return reasons;
}

export function evaluateConstitutionAlignment(inputPayload, {
    now = Date.now,
    weights = null
} = {}) {
    const at = safeNow(now);
    const mergedWeights = normalizeWeights(weights);
    const truthSeeking = scoreTruthSeeking(inputPayload || {});
    const proHumanity = scoreProHumanity(inputPayload || {});
    const curiosity = scoreCuriosity(inputPayload || {});

    const overallScore = Math.round(
        truthSeeking.score * mergedWeights.truthSeeking
        + proHumanity.score * mergedWeights.proHumanity
        + curiosity.score * mergedWeights.curiosity
    );
    const tier = tierFromScores({
        overallScore,
        proHumanity,
        truthSeeking
    });

    const metrics = {
        truthSeeking,
        proHumanity,
        curiosity
    };
    const blockingReasons = buildBlockingReasons(metrics, tier);
    const recommendations = buildRecommendations(metrics, tier);

    return {
        at,
        tier,
        overallScore,
        weights: mergedWeights,
        metrics,
        blockingReasons,
        recommendations
    };
}

export function constitutionRecommendationsToTasks(reportPayload, {
    fromAgentId = 'agent:constitution',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('constitutionRecommendationsToTasks requires report payload');
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
            constitutionTier: reportPayload.tier,
            constitutionScore: reportPayload.overallScore,
            recommendationType: recommendation.type,
            description: recommendation.description
        },
        createdAt: nowMs + index
    }));
}

export class ConstitutionEngine {
    constructor({
        localAgentId = 'agent:constitution',
        now = Date.now,
        maxHistory = 180
    } = {}) {
        this.localAgentId = localAgentId;
        this.now = typeof now === 'function' ? now : Date.now;
        this.maxHistory = Number.isInteger(maxHistory) && maxHistory > 0
            ? maxHistory
            : 180;
        this.history = [];
    }

    evaluate(inputPayload, options = {}) {
        const report = evaluateConstitutionAlignment(inputPayload, {
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
        return constitutionRecommendationsToTasks(reportPayload, {
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

export const __constitutionInternals = {
    normalizeWeights,
    scoreTruthSeeking,
    scoreProHumanity,
    scoreCuriosity,
    tierFromScores,
    buildRecommendations
};
