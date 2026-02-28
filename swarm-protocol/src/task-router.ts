import { TaskRequest } from './schemas.js';

const HEALTHY_STATUSES = new Set(['idle', 'busy']);

const DEFAULT_MAX_STALENESS_MS = 60_000;
const DEFAULT_MAX_FUTURE_SKEW_MS = 5_000;
const DEFAULT_BENCHMARK_THRESHOLDS = Object.freeze({
    minSuccessRate: 0.6,
    maxTimeoutRate: 0.3,
    maxFailureRate: 0.3,
    maxAvgLatencyMs: 400,
    maxP95LatencyMs: 700
});
const DEFAULT_BENCHMARK_WEIGHTS = Object.freeze({
    successRate: 24,
    timeoutRate: 14,
    failureRate: 12,
    avgLatencyMs: 10,
    p95LatencyMs: 6
});

function safeNumber(value, fallback = null) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function normalizeCapabilities(value) {
    if (!Array.isArray(value)) return [];
    return [...new Set(value
        .filter((item) => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
    )];
}

function extractRequiredCapabilities(taskRequest) {
    const required = taskRequest?.context?.requiredCapabilities;
    return normalizeCapabilities(required);
}

function resolvePositiveOption(value, fallback) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
    return parsed;
}

function normalizeBenchmarkThresholds(options) {
    const source = options?.benchmarkThresholds || {};
    return {
        minSuccessRate: clamp(
            safeNumber(source.minSuccessRate, DEFAULT_BENCHMARK_THRESHOLDS.minSuccessRate),
            0,
            1
        ),
        maxTimeoutRate: clamp(
            safeNumber(source.maxTimeoutRate, DEFAULT_BENCHMARK_THRESHOLDS.maxTimeoutRate),
            0,
            1
        ),
        maxFailureRate: clamp(
            safeNumber(source.maxFailureRate, DEFAULT_BENCHMARK_THRESHOLDS.maxFailureRate),
            0,
            1
        ),
        maxAvgLatencyMs: resolvePositiveOption(
            source.maxAvgLatencyMs,
            DEFAULT_BENCHMARK_THRESHOLDS.maxAvgLatencyMs
        ),
        maxP95LatencyMs: resolvePositiveOption(
            source.maxP95LatencyMs,
            DEFAULT_BENCHMARK_THRESHOLDS.maxP95LatencyMs
        )
    };
}

function normalizeBenchmarkWeights(options) {
    const source = options?.benchmarkWeights || {};
    return {
        successRate: resolvePositiveOption(source.successRate, DEFAULT_BENCHMARK_WEIGHTS.successRate),
        timeoutRate: resolvePositiveOption(source.timeoutRate, DEFAULT_BENCHMARK_WEIGHTS.timeoutRate),
        failureRate: resolvePositiveOption(source.failureRate, DEFAULT_BENCHMARK_WEIGHTS.failureRate),
        avgLatencyMs: resolvePositiveOption(source.avgLatencyMs, DEFAULT_BENCHMARK_WEIGHTS.avgLatencyMs),
        p95LatencyMs: resolvePositiveOption(source.p95LatencyMs, DEFAULT_BENCHMARK_WEIGHTS.p95LatencyMs)
    };
}

function getAgentId(agent) {
    if (!agent || typeof agent !== 'object') return null;
    const id = agent.id ?? agent.agentId;
    return typeof id === 'string' && id.trim() ? id.trim() : null;
}

function getSnapshotEntry(snapshot, agentId) {
    if (!snapshot || !agentId) return null;

    if (snapshot instanceof Map) {
        return snapshot.get(agentId) || null;
    }

    if (typeof snapshot === 'object' && !Array.isArray(snapshot)) {
        return snapshot[agentId] || null;
    }

    return null;
}

function normalizeBenchmarkStats(input) {
    if (!input || typeof input !== 'object') {
        return {
            samples: null,
            successRate: null,
            timeoutRate: null,
            failureRate: null,
            avgLatencyMs: null,
            p95LatencyMs: null,
            hasAny: false
        };
    }

    const samples = safeNumber(
        input.samples
            ?? input.sampleSize
            ?? input.runs
            ?? input.count,
        null
    );
    const successRate = safeNumber(
        input.successRate
            ?? input.successRateAvg,
        null
    );
    const timeoutRate = safeNumber(
        input.timeoutRate
            ?? input.timeoutRateAvg,
        null
    );
    const failureRate = safeNumber(
        input.failureRate
            ?? input.failureRateAvg,
        null
    );
    const avgLatencyMs = safeNumber(
        input.avgLatencyMs
            ?? input.latencyAvgMs,
        null
    );
    const p95LatencyMs = safeNumber(
        input.p95LatencyMs
            ?? input.latencyP95Ms,
        null
    );

    const normalized = {
        samples: samples !== null ? Math.max(0, samples) : null,
        successRate: successRate !== null ? clamp(successRate, 0, 1) : null,
        timeoutRate: timeoutRate !== null ? clamp(timeoutRate, 0, 1) : null,
        failureRate: failureRate !== null ? clamp(failureRate, 0, 1) : null,
        avgLatencyMs: avgLatencyMs !== null ? Math.max(0, avgLatencyMs) : null,
        p95LatencyMs: p95LatencyMs !== null ? Math.max(0, p95LatencyMs) : null
    };

    return {
        ...normalized,
        hasAny: Object.values(normalized).some((value) => value !== null)
    };
}

function resolveBenchmarkStats(agent, context) {
    const agentId = getAgentId(agent);
    const candidates = [
        getSnapshotEntry(context?.benchmarkByAgent, agentId),
        getSnapshotEntry(context?.performanceByAgent, agentId),
        getSnapshotEntry(context?.performanceSnapshot, agentId),
        getSnapshotEntry(context?.benchmarkSnapshot, agentId),
        agent?.benchmark,
        agent?.benchmarks,
        agent?.performance,
        agent?.metrics
    ];

    for (const candidate of candidates) {
        const normalized = normalizeBenchmarkStats(candidate);
        if (normalized.hasAny) {
            return normalized;
        }
    }

    return normalizeBenchmarkStats(null);
}

function scoreBenchmark(stats, context) {
    if (!stats?.hasAny) {
        return {
            adjustment: 0,
            confidence: 0,
            stats
        };
    }

    const thresholds = context.benchmarkThresholds;
    const weights = context.benchmarkWeights;

    let adjustment = 0;

    if (stats.successRate !== null) {
        adjustment += (stats.successRate - thresholds.minSuccessRate) * weights.successRate;
    }

    if (stats.timeoutRate !== null) {
        adjustment += (thresholds.maxTimeoutRate - stats.timeoutRate) * weights.timeoutRate;
    }

    if (stats.failureRate !== null) {
        adjustment += (thresholds.maxFailureRate - stats.failureRate) * weights.failureRate;
    }

    if (stats.avgLatencyMs !== null) {
        const delta = (thresholds.maxAvgLatencyMs - stats.avgLatencyMs) / thresholds.maxAvgLatencyMs;
        adjustment += clamp(delta, -2, 2) * weights.avgLatencyMs;
    }

    if (stats.p95LatencyMs !== null) {
        const delta = (thresholds.maxP95LatencyMs - stats.p95LatencyMs) / thresholds.maxP95LatencyMs;
        adjustment += clamp(delta, -2, 2) * weights.p95LatencyMs;
    }

    const sampleConfidenceTarget = resolvePositiveOption(context.minSamplesForFullConfidence, 20);
    const sampleConfidence = stats.samples === null
        ? 0.5
        : clamp(stats.samples / sampleConfidenceTarget, 0, 1);
    const confidence = Number((0.55 + sampleConfidence * 0.45).toFixed(4));

    return {
        adjustment: Number((adjustment * confidence).toFixed(4)),
        confidence,
        stats
    };
}

function evaluateHeartbeat(agent, context) {
    const nowMs = context.nowMs;
    const maxStalenessMs = context.maxStalenessMs;
    const maxFutureSkewMs = context.maxFutureSkewMs;

    const candidates = [
        agent?.timestamp,
        agent?.lastHeartbeat,
        agent?.lastHeartbeatMs,
        agent?.heartbeatAt,
        agent?.lastSeenAt
    ];

    let hasHeartbeatSignal = false;

    for (const candidate of candidates) {
        if (candidate === undefined || candidate === null || candidate === '') {
            continue;
        }

        hasHeartbeatSignal = true;
        const timestamp = Number(candidate);

        if (!Number.isFinite(timestamp)) {
            return {
                eligible: false,
                reason: 'invalid_heartbeat',
                timestamp: null,
                stalenessMs: null,
                state: 'invalid'
            };
        }

        const ageMs = nowMs - timestamp;

        if (ageMs > maxStalenessMs) {
            return {
                eligible: false,
                reason: 'stale_heartbeat',
                timestamp,
                stalenessMs: ageMs,
                state: 'stale'
            };
        }

        if (ageMs < -maxFutureSkewMs) {
            return {
                eligible: false,
                reason: 'invalid_heartbeat',
                timestamp,
                stalenessMs: ageMs,
                state: 'future_skew'
            };
        }

        return {
            eligible: true,
            reason: 'fresh_heartbeat',
            timestamp,
            stalenessMs: Math.max(0, ageMs),
            state: 'fresh'
        };
    }

    return {
        eligible: true,
        reason: 'missing_heartbeat',
        timestamp: null,
        stalenessMs: null,
        state: hasHeartbeatSignal ? 'invalid' : 'missing'
    };
}

function scoreAgent(taskRequest, agent, context) {
    if (!agent || typeof agent !== 'object') {
        return {
            eligible: false,
            score: -Infinity,
            reason: 'invalid_agent',
            benchmarkConfidence: 0
        };
    }

    const status = typeof agent.status === 'string' ? agent.status : 'offline';
    if (!HEALTHY_STATUSES.has(status)) {
        return {
            eligible: false,
            score: -Infinity,
            reason: `status_${status}`,
            benchmarkConfidence: 0
        };
    }

    const heartbeat = evaluateHeartbeat(agent, context);
    if (!heartbeat.eligible) {
        return {
            eligible: false,
            score: -Infinity,
            reason: heartbeat.reason,
            benchmarkConfidence: 0
        };
    }

    const load = Number.isFinite(Number(agent.load))
        ? Math.max(0, Math.min(1, Number(agent.load)))
        : 0.5;

    const capabilities = normalizeCapabilities(agent.capabilities);
    const requiredCapabilities = extractRequiredCapabilities(taskRequest);
    const missingCapabilities = requiredCapabilities.filter((capability) => !capabilities.includes(capability));
    if (missingCapabilities.length > 0) {
        return {
            eligible: false,
            score: -Infinity,
            reason: 'missing_capabilities',
            missingCapabilities,
            benchmarkConfidence: 0
        };
    }

    const priority = taskRequest.priority || 'normal';
    let score = 100;

    score -= load * 60;

    if (status === 'idle') score += 15;
    if (status === 'busy') score -= 5;

    const matchingCapabilities = requiredCapabilities.length;
    score += matchingCapabilities * 20;

    if (priority === 'critical') {
        score += 20;
        if (load > 0.85) score -= 25;
    } else if (priority === 'high') {
        score += 10;
    } else if (priority === 'low') {
        score -= 5;
    }

    if (heartbeat.state === 'missing') {
        score -= 6;
    }

    const benchmark = scoreBenchmark(resolveBenchmarkStats(agent, context), context);
    score += benchmark.adjustment;

    return {
        eligible: true,
        score: Number(score.toFixed(4)),
        reason: 'ok',
        missingCapabilities: [],
        benchmarkConfidence: benchmark.confidence,
        benchmarkAdjustment: benchmark.adjustment,
        heartbeatStalenessMs: heartbeat.stalenessMs
    };
}

function buildScoringContext(options = {}) {
    const nowMs = Number.isFinite(options.nowMs) ? Number(options.nowMs) : Date.now();
    return {
        ...options,
        nowMs,
        maxStalenessMs: resolvePositiveOption(options.maxStalenessMs, DEFAULT_MAX_STALENESS_MS),
        maxFutureSkewMs: resolvePositiveOption(options.maxFutureSkewMs, DEFAULT_MAX_FUTURE_SKEW_MS),
        benchmarkThresholds: normalizeBenchmarkThresholds(options),
        benchmarkWeights: normalizeBenchmarkWeights(options),
        minSamplesForFullConfidence: resolvePositiveOption(options.minSamplesForFullConfidence, 20)
    };
}

function compareRankedAgents(a, b) {
    if (a.eligible !== b.eligible) {
        return a.eligible ? -1 : 1;
    }

    if (a.score !== b.score) {
        return b.score - a.score;
    }

    if (a.benchmarkConfidence !== b.benchmarkConfidence) {
        return b.benchmarkConfidence - a.benchmarkConfidence;
    }

    const statusRankA = a.status === 'idle' ? 2 : a.status === 'busy' ? 1 : 0;
    const statusRankB = b.status === 'idle' ? 2 : b.status === 'busy' ? 1 : 0;
    if (statusRankA !== statusRankB) {
        return statusRankB - statusRankA;
    }

    const loadA = Number.isFinite(Number(a.load)) ? Number(a.load) : 1;
    const loadB = Number.isFinite(Number(b.load)) ? Number(b.load) : 1;
    if (loadA !== loadB) {
        return loadA - loadB;
    }

    const stalenessA = Number.isFinite(a.heartbeatStalenessMs)
        ? a.heartbeatStalenessMs
        : Number.POSITIVE_INFINITY;
    const stalenessB = Number.isFinite(b.heartbeatStalenessMs)
        ? b.heartbeatStalenessMs
        : Number.POSITIVE_INFINITY;
    if (stalenessA !== stalenessB) {
        return stalenessA - stalenessB;
    }

    const capabilityCountA = Array.isArray(a.capabilities) ? a.capabilities.length : 0;
    const capabilityCountB = Array.isArray(b.capabilities) ? b.capabilities.length : 0;
    if (capabilityCountA !== capabilityCountB) {
        return capabilityCountB - capabilityCountA;
    }

    const idA = typeof a.agentId === 'string' ? a.agentId : '';
    const idB = typeof b.agentId === 'string' ? b.agentId : '';
    const idCompare = idA.localeCompare(idB);
    if (idCompare !== 0) return idCompare;

    return (a._sortIndex || 0) - (b._sortIndex || 0);
}

export function rankAgentsForTask(taskRequestPayload, agents, options = {}) {
    const taskRequest = TaskRequest.parse(taskRequestPayload);
    if (!Array.isArray(agents)) {
        throw new Error('agents must be an array');
    }

    const scoringContext = buildScoringContext(options);

    return agents
        .map((agent, index) => {
            const evaluation = scoreAgent(taskRequest, agent, scoringContext);
            return {
                agentId: getAgentId(agent),
                status: agent?.status,
                load: agent?.load,
                capabilities: normalizeCapabilities(agent?.capabilities),
                ...evaluation,
                _sortIndex: index
            };
        })
        .sort(compareRankedAgents)
        .map(({ _sortIndex, ...candidate }) => candidate);
}

export function selectBestAgentForTask(taskRequestPayload, agents, options = {}) {
    const ranked = rankAgentsForTask(taskRequestPayload, agents, options);
    const best = ranked.find((item) => item.eligible && typeof item.agentId === 'string' && item.agentId.trim());

    return {
        selectedAgentId: best?.agentId || null,
        ranked
    };
}

export function routeTaskRequest(taskRequestPayload, agents, options = {}) {
    const taskRequest = TaskRequest.parse(taskRequestPayload);
    const selection = selectBestAgentForTask(taskRequest, agents, options);

    if (!selection.selectedAgentId) {
        return {
            routed: false,
            taskRequest,
            selectedAgentId: null,
            ranked: selection.ranked
        };
    }

    return {
        routed: true,
        selectedAgentId: selection.selectedAgentId,
        ranked: selection.ranked,
        taskRequest: {
            ...taskRequest,
            target: selection.selectedAgentId
        }
    };
}
