import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';
import { planMissionPortfolio } from './mission-portfolio.js';

const ScenarioTaskTargetMap = {
    apply_scenario: 'agent:planner',
    unblock_mission: 'agent:planner',
    prepare_mission: 'agent:planner'
};

const RecommendationPriorityToTaskPriority = {
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

function clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, value));
}

function normalizeScenario(scenarioPayload, index) {
    const scenario = scenarioPayload && typeof scenarioPayload === 'object'
        ? scenarioPayload
        : {};
    const name = typeof scenario.name === 'string' && scenario.name.trim()
        ? scenario.name.trim()
        : `scenario-${index + 1}`;
    const maxConcurrentMissions = Number.isFinite(Number(scenario.maxConcurrentMissions))
        ? Number(scenario.maxConcurrentMissions)
        : null;
    const missionOverrides = scenario.missionOverrides && typeof scenario.missionOverrides === 'object'
        ? scenario.missionOverrides
        : {};

    return {
        name,
        maxConcurrentMissions,
        missionOverrides,
        notes: typeof scenario.notes === 'string' ? scenario.notes : ''
    };
}

function applyMissionOverrides(baseMissions, missionOverrides) {
    const overrides = missionOverrides && typeof missionOverrides === 'object'
        ? missionOverrides
        : {};

    return baseMissions.map((mission) => {
        const missionId = mission?.missionId || mission?.missionPlan?.missionId;
        if (!missionId) return clone(mission);
        const override = overrides[missionId];
        if (!override || typeof override !== 'object') {
            return clone(mission);
        }

        const merged = clone(mission);

        if (Number.isFinite(Number(override.impactScore))) {
            merged.impactScore = Number(override.impactScore);
        }
        if (Number.isFinite(Number(override.urgencyScore))) {
            merged.urgencyScore = Number(override.urgencyScore);
        }
        if (Number.isFinite(Number(override.deadlineAt))) {
            merged.deadlineAt = Number(override.deadlineAt);
        }
        if (typeof override.preferredTarget === 'string') {
            merged.preferredTarget = override.preferredTarget;
        }

        if (override.readinessReport && typeof override.readinessReport === 'object') {
            merged.readinessReport = {
                ...(merged.readinessReport || {}),
                ...override.readinessReport
            };
        }

        if (override.governorDecision && typeof override.governorDecision === 'object') {
            merged.governorDecision = {
                ...(merged.governorDecision || {}),
                ...override.governorDecision
            };
        }

        return merged;
    });
}

function scenarioMetrics(portfolioReport) {
    const ranked = Array.isArray(portfolioReport?.rankedMissions)
        ? portfolioReport.rankedMissions
        : [];
    const total = ranked.length;
    const nowMissions = ranked.filter((entry) => entry.scheduledLane === 'now');
    const nextMissions = ranked.filter((entry) => entry.scheduledLane === 'next');
    const holdMissions = ranked.filter((entry) => entry.scheduledLane === 'hold');
    const blockedHold = holdMissions.filter((entry) => entry.readinessStatus === 'blocked' || entry.governorMode === 'halted');
    const capacityDeferred = ranked.filter((entry) => entry.capacityDeferred === true);

    const nowScoreSum = nowMissions.reduce((acc, entry) => acc + safeNumber(entry.score, 0), 0);
    const avgNowScore = nowMissions.length > 0
        ? Number((nowScoreSum / nowMissions.length).toFixed(2))
        : 0;
    const coverageScore = total > 0
        ? Number(((nowMissions.length / total) * 100).toFixed(2))
        : 0;
    const blockedRatioPenalty = total > 0
        ? (blockedHold.length / total) * 35
        : 0;
    const deferredPenalty = capacityDeferred.length * 5;
    const throughputScore = total > 0
        ? Number((((nowMissions.length + nextMissions.length) / total) * 100).toFixed(2))
        : 0;

    const scenarioScore = clamp(Math.round(
        avgNowScore * 0.5
        + coverageScore * 0.35
        + throughputScore * 0.15
        - blockedRatioPenalty
        - deferredPenalty
    ));

    return {
        missionCount: total,
        nowCount: nowMissions.length,
        nextCount: nextMissions.length,
        holdCount: holdMissions.length,
        blockedHoldCount: blockedHold.length,
        capacityDeferredCount: capacityDeferred.length,
        avgNowScore,
        coverageScore,
        throughputScore,
        scenarioScore
    };
}

function evaluateScenario({
    name,
    notes,
    baseMissions,
    missionOverrides,
    baseMaxConcurrentMissions,
    maxConcurrentMissions,
    nowMs,
    weights
}) {
    const missions = applyMissionOverrides(baseMissions, missionOverrides);
    const capacity = Number.isFinite(Number(maxConcurrentMissions))
        ? Number(maxConcurrentMissions)
        : baseMaxConcurrentMissions;
    const portfolio = planMissionPortfolio({
        missions
    }, {
        now: () => nowMs,
        maxConcurrentMissions: capacity,
        weights
    });
    const metrics = scenarioMetrics(portfolio);

    return {
        name,
        notes,
        maxConcurrentMissions: capacity,
        metrics,
        portfolio
    };
}

function compareMetrics(candidate, baseline) {
    return {
        scenario: candidate.name,
        deltaScenarioScore: candidate.metrics.scenarioScore - baseline.metrics.scenarioScore,
        deltaNowCount: candidate.metrics.nowCount - baseline.metrics.nowCount,
        deltaHoldCount: candidate.metrics.holdCount - baseline.metrics.holdCount,
        deltaBlockedHoldCount: candidate.metrics.blockedHoldCount - baseline.metrics.blockedHoldCount
    };
}

function pickRecommendedScenario(scenarios) {
    if (!Array.isArray(scenarios) || scenarios.length === 0) {
        return null;
    }

    return [...scenarios].sort((a, b) => {
        if (b.metrics.scenarioScore !== a.metrics.scenarioScore) {
            return b.metrics.scenarioScore - a.metrics.scenarioScore;
        }
        if (b.metrics.nowCount !== a.metrics.nowCount) {
            return b.metrics.nowCount - a.metrics.nowCount;
        }
        if (a.metrics.blockedHoldCount !== b.metrics.blockedHoldCount) {
            return a.metrics.blockedHoldCount - b.metrics.blockedHoldCount;
        }
        return String(a.name).localeCompare(String(b.name));
    })[0];
}

export function forecastMissionPortfolioScenarios(inputPayload, {
    now = Date.now,
    maxConcurrentMissions = 3,
    weights = {}
} = {}) {
    const nowMs = safeNow(now);
    const baseMissions = Array.isArray(inputPayload?.missions)
        ? inputPayload.missions.map((mission) => clone(mission))
        : [];
    const scenarioPayloads = Array.isArray(inputPayload?.scenarios)
        ? inputPayload.scenarios
        : [];
    const scenarios = scenarioPayloads.map((scenario, index) => normalizeScenario(scenario, index));

    const baseline = evaluateScenario({
        name: 'baseline',
        notes: 'Current operating configuration',
        baseMissions,
        missionOverrides: {},
        baseMaxConcurrentMissions: maxConcurrentMissions,
        maxConcurrentMissions,
        nowMs,
        weights
    });

    const evaluatedScenarios = scenarios.map((scenario) => evaluateScenario({
        name: scenario.name,
        notes: scenario.notes,
        baseMissions,
        missionOverrides: scenario.missionOverrides,
        baseMaxConcurrentMissions: maxConcurrentMissions,
        maxConcurrentMissions: scenario.maxConcurrentMissions,
        nowMs,
        weights
    }));

    const allScenarios = [baseline, ...evaluatedScenarios];
    const recommendedScenario = pickRecommendedScenario(allScenarios);
    const comparison = allScenarios.map((scenario) => compareMetrics(scenario, baseline));

    return {
        at: nowMs,
        baseline: clone(baseline),
        scenarios: evaluatedScenarios.map((scenario) => clone(scenario)),
        comparison,
        recommendedScenario: recommendedScenario ? clone(recommendedScenario) : null
    };
}

export function forecastToTaskRequests(forecastPayload, {
    fromAgentId = 'agent:mission-forecast',
    defaultTarget = 'agent:planner',
    targetMap = {}
} = {}) {
    if (!forecastPayload || typeof forecastPayload !== 'object') {
        throw new Error('forecastToTaskRequests requires forecast payload');
    }

    const recommended = forecastPayload.recommendedScenario;
    if (!recommended) return [];

    const tasks = [];
    const targets = {
        ...ScenarioTaskTargetMap,
        ...(targetMap || {})
    };
    const nowMs = safeNow(Date.now);

    tasks.push(buildTaskRequest({
        id: randomUUID(),
        from: fromAgentId,
        target: targets.apply_scenario || defaultTarget,
        priority: 'high',
        task: `Adopt scenario "${recommended.name}" for next mission portfolio cycle`,
        context: {
            scenarioName: recommended.name,
            scenarioNotes: recommended.notes,
            scenarioScore: recommended.metrics.scenarioScore,
            nowCount: recommended.metrics.nowCount,
            holdCount: recommended.metrics.holdCount
        },
        createdAt: nowMs
    }));

    const recommendations = Array.isArray(recommended?.portfolio?.recommendations)
        ? recommended.portfolio.recommendations
        : [];
    for (let i = 0; i < recommendations.length; i++) {
        const recommendation = recommendations[i];
        tasks.push(buildTaskRequest({
            id: randomUUID(),
            from: fromAgentId,
            target: targets[recommendation.type] || defaultTarget,
            priority: RecommendationPriorityToTaskPriority[recommendation.priority] || 'normal',
            task: `[${recommendation.priority}] Scenario follow-up: ${recommendation.title}`,
            context: {
                scenarioName: recommended.name,
                missionId: recommendation.missionId,
                recommendationType: recommendation.type,
                description: recommendation.description
            },
            createdAt: nowMs + i + 1
        }));
    }

    return tasks;
}

export class MissionForecastLab {
    constructor({
        localAgentId = 'agent:mission-forecast',
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
        const forecast = forecastMissionPortfolioScenarios(inputPayload, {
            now: this.now,
            ...options
        });
        this.history.push(forecast);
        if (this.history.length > this.maxHistory) {
            this.history.splice(0, this.history.length - this.maxHistory);
        }
        return clone(forecast);
    }

    buildTaskRequests(forecastPayload, options = {}) {
        return forecastToTaskRequests(forecastPayload, {
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

export const __missionForecastInternals = {
    normalizeScenario,
    applyMissionOverrides,
    scenarioMetrics,
    compareMetrics,
    pickRecommendedScenario
};
