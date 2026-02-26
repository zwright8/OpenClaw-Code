import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';
import { evaluateAutonomousApproval } from './autonomous-approval.js';

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

function normalizeTaskPriority(priority) {
    const normalized = typeof priority === 'string' ? priority.trim().toLowerCase() : '';
    if (['low', 'normal', 'high', 'critical'].includes(normalized)) {
        return normalized;
    }
    return 'normal';
}

function normalizeMissionPriority(score) {
    const numeric = safeNumber(score, 0);
    if (numeric >= 85) return 'critical';
    if (numeric >= 70) return 'high';
    if (numeric >= 50) return 'normal';
    return 'low';
}

function normalizeRankedMissions(portfolioPayload) {
    const source = Array.isArray(portfolioPayload?.rankedMissions)
        ? portfolioPayload.rankedMissions
        : [];

    return source.map((mission, index) => ({
        missionId: mission?.missionId || `mission-${index + 1}`,
        objective: mission?.objective || mission?.missionId || `Mission ${index + 1}`,
        preferredTarget: mission?.preferredTarget || null,
        scheduledLane: mission?.scheduledLane || mission?.lane || 'next',
        score: safeNumber(mission?.score, 0),
        readinessStatus: mission?.readinessStatus || 'ready',
        governorMode: mission?.governorMode || 'normal',
        governorRiskScore: safeNumber(mission?.governorRiskScore, 0),
        estimatedDurationMs: safeNumber(mission?.estimatedDurationMs, 60_000)
    }));
}

function normalizePortfolioFromInput(inputPayload) {
    const forecastPortfolio = inputPayload?.forecastReport?.recommendedScenario?.portfolio;
    if (forecastPortfolio && typeof forecastPortfolio === 'object') {
        return {
            source: 'forecast_recommended',
            portfolio: forecastPortfolio
        };
    }

    return {
        source: 'portfolio',
        portfolio: inputPayload?.portfolioReport || {}
    };
}

function summarizeBatchRows(rows) {
    const summary = {
        totalCandidates: rows.length,
        immediateLaunchCount: 0,
        deferredCount: 0,
        blockedCount: 0,
        avgMissionScore: 0,
        avgMissionRisk: 0
    };

    let scoreTotal = 0;
    let riskTotal = 0;

    for (const row of rows) {
        scoreTotal += safeNumber(row.score, 0);
        riskTotal += safeNumber(row.governorRiskScore, 0);
        if (row.launchDecision === 'immediate') summary.immediateLaunchCount++;
        if (row.launchDecision === 'deferred') summary.deferredCount++;
        if (row.launchDecision === 'blocked') summary.blockedCount++;
    }

    if (rows.length > 0) {
        summary.avgMissionScore = Number((scoreTotal / rows.length).toFixed(2));
        summary.avgMissionRisk = Number((riskTotal / rows.length).toFixed(2));
    }

    return summary;
}

export function compileAutonomousLaunchBatch(inputPayload, {
    now = Date.now,
    enabled = true,
    fromAgentId = 'agent:autonomous-launcher',
    defaultTarget = 'agent:ops',
    maxLaunches = null,
    approvalOptions = {},
    baseApprovalPolicy = null
} = {}) {
    const at = safeNow(now);
    const portfolioSource = normalizePortfolioFromInput(inputPayload || {});
    const rankedMissions = normalizeRankedMissions(portfolioSource.portfolio);
    const nowLaneMissions = rankedMissions
        .filter((mission) => mission.scheduledLane === 'now')
        .sort((a, b) => b.score - a.score);

    const effectiveMaxLaunches = Number.isFinite(Number(maxLaunches))
        ? Math.max(0, Math.floor(Number(maxLaunches)))
        : nowLaneMissions.length;

    const rows = [];
    let launchedCount = 0;

    for (let index = 0; index < nowLaneMissions.length; index++) {
        const mission = nowLaneMissions[index];
        const taskRequest = buildTaskRequest({
            id: randomUUID(),
            from: fromAgentId,
            target: mission.preferredTarget || defaultTarget,
            priority: normalizeTaskPriority(normalizeMissionPriority(mission.score)),
            task: `Launch mission ${mission.missionId}: ${mission.objective}`,
            context: {
                missionId: mission.missionId,
                launchSource: portfolioSource.source,
                missionScore: mission.score,
                missionRisk: mission.governorRiskScore,
                readinessStatus: mission.readinessStatus,
                governorMode: mission.governorMode,
                estimatedDurationMs: mission.estimatedDurationMs,
                requiredCapabilities: ['operations'],
                riskTags: mission.governorMode === 'halted' ? ['production'] : []
            },
            createdAt: at + index
        });

        const approval = evaluateAutonomousApproval(taskRequest, {
            ...approvalOptions,
            baseApprovalPolicy,
            now: () => at + index
        });

        let launchDecision = 'deferred';
        let reason = 'capacity_deferred';

        if (!enabled) {
            launchDecision = 'deferred';
            reason = 'launcher_disabled';
        } else if (approval.outcome === 'denied' || mission.readinessStatus === 'blocked' || mission.governorMode === 'halted') {
            launchDecision = 'blocked';
            reason = approval.outcome === 'denied'
                ? (approval?.decision?.reason || 'approval_denied')
                : (mission.readinessStatus === 'blocked' ? 'mission_blocked' : 'governor_halted');
        } else if (launchedCount < effectiveMaxLaunches) {
            launchDecision = 'immediate';
            reason = 'launch_ready';
            launchedCount++;
        } else {
            launchDecision = 'deferred';
            reason = 'capacity_deferred';
        }

        rows.push({
            missionId: mission.missionId,
            objective: mission.objective,
            score: mission.score,
            governorRiskScore: mission.governorRiskScore,
            target: taskRequest.target || defaultTarget,
            taskRequest,
            approval,
            launchDecision,
            reason
        });
    }

    const summary = summarizeBatchRows(rows);
    return {
        at,
        enabled,
        source: portfolioSource.source,
        summary,
        launches: rows.map((row) => clone(row))
    };
}

export function launchBatchToDispatchTasks(batchPayload) {
    if (!batchPayload || typeof batchPayload !== 'object') {
        throw new Error('launchBatchToDispatchTasks requires batch payload');
    }

    const launches = Array.isArray(batchPayload.launches) ? batchPayload.launches : [];
    return launches
        .filter((row) => row.launchDecision === 'immediate')
        .map((row) => clone(row.taskRequest));
}

export function launchBatchToFollowupTasks(batchPayload, {
    fromAgentId = 'agent:autonomous-launcher',
    defaultTarget = 'agent:planner'
} = {}) {
    if (!batchPayload || typeof batchPayload !== 'object') {
        throw new Error('launchBatchToFollowupTasks requires batch payload');
    }

    const launches = Array.isArray(batchPayload.launches) ? batchPayload.launches : [];
    const at = safeNow(Date.now);
    const tasks = [];

    for (let index = 0; index < launches.length; index++) {
        const row = launches[index];
        if (row.launchDecision === 'immediate') continue;

        const priority = row.launchDecision === 'blocked' ? 'high' : 'normal';
        const label = row.launchDecision === 'blocked'
            ? `Resolve launch blocker for mission ${row.missionId}`
            : `Prepare deferred mission ${row.missionId} for next slot`;

        tasks.push(buildTaskRequest({
            id: randomUUID(),
            from: fromAgentId,
            target: defaultTarget,
            priority,
            task: label,
            context: {
                missionId: row.missionId,
                launchDecision: row.launchDecision,
                launchReason: row.reason,
                score: row.score,
                risk: row.governorRiskScore
            },
            createdAt: at + index
        }));
    }

    return tasks;
}

export class AutonomousMissionLauncher {
    constructor({
        localAgentId = 'agent:autonomous-launcher',
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

    compile(inputPayload, options = {}) {
        const batch = compileAutonomousLaunchBatch(inputPayload, {
            now: this.now,
            fromAgentId: this.localAgentId,
            ...options
        });
        this.history.push(batch);
        if (this.history.length > this.maxHistory) {
            this.history.splice(0, this.history.length - this.maxHistory);
        }
        return clone(batch);
    }

    buildDispatchTasks(batchPayload) {
        return launchBatchToDispatchTasks(batchPayload);
    }

    buildFollowupTasks(batchPayload, options = {}) {
        return launchBatchToFollowupTasks(batchPayload, {
            fromAgentId: this.localAgentId,
            ...options
        });
    }

    listHistory({ limit = 25 } = {}) {
        return this.history
            .slice(-Math.max(1, Number(limit) || 25))
            .map((entry) => clone(entry));
    }
}

export const __missionLauncherInternals = {
    normalizeRankedMissions,
    normalizePortfolioFromInput,
    summarizeBatchRows,
    normalizeMissionPriority
};
