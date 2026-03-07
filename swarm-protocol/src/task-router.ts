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
const DEFAULT_LOAD_PENALTY_WEIGHT = 60;
const DEFAULT_STALENESS_PENALTY_WEIGHT = 10;
const DEFAULT_MISSING_HEARTBEAT_PENALTY = 6;
const DEFAULT_FAILURE_PENALTY_WEIGHT = 18;
const DEFAULT_TIMEOUT_PENALTY_WEIGHT = 12;
const DEFAULT_LOAD_SOFT_CAP = 0.7;
const DEFAULT_STALENESS_SOFT_RATIO = 0.5;
const DEFAULT_RELIABILITY_OVERAGE_MULTIPLIER = 2;
const DEFAULT_LOAD_SURGE_EXPONENT = 2.4;
const DEFAULT_STALENESS_SURGE_EXPONENT = 2.2;
const DEFAULT_LOAD_CRITICAL_THRESHOLD = 0.9;
const DEFAULT_STALENESS_CRITICAL_RATIO = 0.85;
const DEFAULT_LOAD_CRITICAL_MULTIPLIER = 1.1;
const DEFAULT_STALENESS_CRITICAL_MULTIPLIER = 0.9;
const DEFAULT_LOW_SAMPLE_OVERAGE_MULTIPLIER = 0.5;
const DEFAULT_RELIABILITY_FLOOR_MIN_SAMPLES = 8;
const DEFAULT_RELIABILITY_FLOOR_SUCCESS_RATIO = 0.92;
const DEFAULT_RELIABILITY_FLOOR_OVERAGE_RATIO = 1.05;
const DEFAULT_RELIABILITY_FLOOR_COMBINED_ERROR_MULTIPLIER = 1.15;
const DEFAULT_TIMEOUT_PRESSURE_WEIGHT = 16;
const DEFAULT_TIMEOUT_PRESSURE_TRIGGER_RATIO = 0.45;
const DEFAULT_TIMEOUT_PRESSURE_EXPONENT = 2.1;
const DEFAULT_TIMEOUT_PRESSURE_FULL_CONFIDENCE_SAMPLES = 20;
const DEFAULT_P95_TIMEOUT_PRESSURE_WEIGHT = 6;
const DEFAULT_P95_TIMEOUT_PRESSURE_TRIGGER_RATIO = 0.7;
const DEFAULT_P95_TIMEOUT_PRESSURE_EXPONENT = 2;
const DEFAULT_DEGRADED_FALLBACK_REASONS = Object.freeze([
    'stale_heartbeat',
    'reliability_floor_breach'
]);
const KNOWN_DEGRADED_FALLBACK_REASON_SET = new Set(DEFAULT_DEGRADED_FALLBACK_REASONS);
const SCORE_EPSILON = 1e-6;

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

function normalizePriority(value, fallback = 'normal') {
    if (typeof value !== 'string') return fallback;
    const normalized = value.trim().toLowerCase();
    if (normalized === 'critical' || normalized === 'high' || normalized === 'normal' || normalized === 'low') {
        return normalized;
    }
    return fallback;
}

function extractRequiredCapabilities(taskRequest) {
    const required = taskRequest?.context?.requiredCapabilities;
    return normalizeCapabilities(required);
}

function normalizeRoutingPolicy(options = {}) {
    const policy = options?.routingPolicy && typeof options.routingPolicy === 'object'
        ? options.routingPolicy
        : options;
    return {
        minSamplesForReliability: resolvePositiveOption(policy.minSamplesForReliability, 3),
        latencyPenaltyStartMs: resolvePositiveOption(policy.latencyPenaltyStartMs, 1_500),
        latencyPenaltyCapMs: resolvePositiveOption(policy.latencyPenaltyCapMs, 15_000),
        overloadThreshold: resolveUnitIntervalOption(policy.overloadThreshold, 0.98)
    };
}

function normalizeRoutingHints(agent) {
    const hints = agent?.routingHints && typeof agent.routingHints === 'object'
        ? agent.routingHints
        : {};
    const successRate = safeNumber(hints.successRate, 1);
    const attempts = safeNumber(hints.attempts, 0);
    const consecutiveFailures = safeNumber(hints.consecutiveFailures, 0);
    const cooldownUntilMs = safeNumber(hints.cooldownUntilMs, 0);
    const ewmaLatencyMs = safeNumber(hints.ewmaLatencyMs, null);
    return {
        successRate: clamp(successRate, 0, 1),
        attempts: Math.max(0, attempts),
        consecutiveFailures: Math.max(0, consecutiveFailures),
        cooldownUntilMs: Math.max(0, cooldownUntilMs),
        ewmaLatencyMs: Number.isFinite(ewmaLatencyMs) ? Math.max(0, ewmaLatencyMs) : null
    };
}

function normalizeFallbackReason(value) {
    if (typeof value !== 'string') return null;
    const normalized = value.trim().toLowerCase();
    return normalized || null;
}

function resolvePositiveOption(value, fallback) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
    return parsed;
}

function resolveNonNegativeOption(value, fallback) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 0) return fallback;
    return parsed;
}

function resolveUnitIntervalOption(value, fallback) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return clamp(parsed, 0, 1);
}

function compareText(a, b) {
    if (a === b) return 0;
    return a < b ? -1 : 1;
}

function compareNumberAscending(a, b, epsilon = SCORE_EPSILON) {
    if (!Number.isFinite(a) && !Number.isFinite(b)) return 0;
    if (!Number.isFinite(a)) return 1;
    if (!Number.isFinite(b)) return -1;
    if (Math.abs(a - b) <= epsilon) return 0;
    return a < b ? -1 : 1;
}

function compareNumberDescending(a, b, epsilon = SCORE_EPSILON) {
    return compareNumberAscending(b, a, epsilon);
}

function formatFiniteNumber(value, digits = 4) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed.toFixed(digits) : 'na';
}

function buildTieBreakKey(candidate) {
    const normalizedCapabilities = normalizeCapabilities(candidate?.capabilities).sort((a, b) => compareText(a, b));
    const missingCapabilities = normalizeCapabilities(candidate?.missingCapabilities).sort((a, b) => compareText(a, b));
    const id = typeof candidate?.agentId === 'string' && candidate.agentId.trim()
        ? candidate.agentId.trim()
        : 'unknown-agent';
    const status = typeof candidate?.status === 'string' && candidate.status.trim()
        ? candidate.status.trim()
        : 'unknown-status';
    const reason = typeof candidate?.reason === 'string' && candidate.reason.trim()
        ? candidate.reason.trim()
        : 'no-reason';
    const eligibility = candidate?.eligible ? 'eligible' : 'ineligible';

    return [
        id,
        status,
        eligibility,
        reason,
        formatFiniteNumber(candidate?.score),
        formatFiniteNumber(candidate?.load),
        formatFiniteNumber(candidate?.benchmarkConfidence),
        formatFiniteNumber(candidate?.loadPenalty),
        formatFiniteNumber(candidate?.stalenessPenalty),
        formatFiniteNumber(candidate?.reliabilityPenalty),
        formatFiniteNumber(candidate?.timeoutPressurePenalty),
        formatFiniteNumber(candidate?.heartbeatStalenessMs),
        normalizedCapabilities.join(','),
        missingCapabilities.join(',')
    ].join('|');
}

function resolveFallbackReasonConfig(options) {
    const configured = [];
    for (const reason of normalizeCapabilities(options?.degradedFallbackReasons)) {
        const normalized = normalizeFallbackReason(reason);
        if (!normalized) continue;
        if (!KNOWN_DEGRADED_FALLBACK_REASON_SET.has(normalized)) continue;
        if (configured.includes(normalized)) continue;
        configured.push(normalized);
    }

    const orderedReasons = configured.length > 0
        ? configured
        : [...DEFAULT_DEGRADED_FALLBACK_REASONS];

    return {
        orderedReasons,
        allowedReasonSet: new Set(orderedReasons),
        reasonRankByReason: new Map(orderedReasons.map((reason, index) => [reason, index]))
    };
}

function compareDegradedFallbackCandidates(a, b, reasonRankByReason) {
    const reasonRankA = reasonRankByReason.get(a.reason) ?? Number.MAX_SAFE_INTEGER;
    const reasonRankB = reasonRankByReason.get(b.reason) ?? Number.MAX_SAFE_INTEGER;
    const reasonRankCompare = compareNumberAscending(reasonRankA, reasonRankB, 0);
    if (reasonRankCompare !== 0) {
        return reasonRankCompare;
    }

    const reliabilitySeverityCompare = compareNumberAscending(
        a.reliabilityFloorSeverity,
        b.reliabilityFloorSeverity
    );
    if (reliabilitySeverityCompare !== 0) {
        return reliabilitySeverityCompare;
    }

    const timeoutPressureCompare = compareNumberAscending(a.timeoutPressurePenalty, b.timeoutPressurePenalty);
    if (timeoutPressureCompare !== 0) {
        return timeoutPressureCompare;
    }

    const reliabilityPenaltyCompare = compareNumberAscending(a.reliabilityPenalty, b.reliabilityPenalty);
    if (reliabilityPenaltyCompare !== 0) {
        return reliabilityPenaltyCompare;
    }

    const confidenceCompare = compareNumberDescending(a.benchmarkConfidence, b.benchmarkConfidence);
    if (confidenceCompare !== 0) {
        return confidenceCompare;
    }

    const statusRankA = a.status === 'idle' ? 2 : a.status === 'busy' ? 1 : 0;
    const statusRankB = b.status === 'idle' ? 2 : b.status === 'busy' ? 1 : 0;
    const statusCompare = compareNumberDescending(statusRankA, statusRankB, 0);
    if (statusCompare !== 0) {
        return statusCompare;
    }

    const loadA = Number.isFinite(Number(a.load)) ? Number(a.load) : 1;
    const loadB = Number.isFinite(Number(b.load)) ? Number(b.load) : 1;
    const loadCompare = compareNumberAscending(loadA, loadB);
    if (loadCompare !== 0) {
        return loadCompare;
    }

    const stalenessA = Number.isFinite(a.heartbeatStalenessMs)
        ? Number(a.heartbeatStalenessMs)
        : Number.POSITIVE_INFINITY;
    const stalenessB = Number.isFinite(b.heartbeatStalenessMs)
        ? Number(b.heartbeatStalenessMs)
        : Number.POSITIVE_INFINITY;
    const stalenessCompare = compareNumberAscending(stalenessA, stalenessB);
    if (stalenessCompare !== 0) {
        return stalenessCompare;
    }

    const idA = typeof a.agentId === 'string' ? a.agentId : '';
    const idB = typeof b.agentId === 'string' ? b.agentId : '';
    const idCompare = compareText(idA, idB);
    if (idCompare !== 0) {
        return idCompare;
    }

    const tieBreakKeyCompare = compareText(a._tieBreakKey || '', b._tieBreakKey || '');
    if (tieBreakKeyCompare !== 0) {
        return tieBreakKeyCompare;
    }

    return 0;
}

function selectDegradedFallbackCandidate(taskRequest, ranked, options = {}) {
    const fallbackConfig = resolveFallbackReasonConfig(options);
    const priority = normalizePriority(taskRequest?.priority);

    const candidates = [];

    for (const candidate of ranked) {
        if (!candidate || candidate.eligible) continue;
        if (typeof candidate.agentId !== 'string' || !candidate.agentId.trim()) continue;

        const missingCapabilities = normalizeCapabilities(candidate.missingCapabilities);
        if (missingCapabilities.length > 0) continue;

        if (!fallbackConfig.allowedReasonSet.has(candidate.reason)) continue;

        if (candidate.reason === 'reliability_floor_breach') {
            if (priority === 'critical' && options.allowCriticalReliabilityFallback !== true) {
                continue;
            }

            if (priority === 'high' && options.allowHighReliabilityFallback !== true) {
                continue;
            }
        }

        candidates.push(candidate);
    }

    if (candidates.length === 0) return null;

    candidates.sort((a, b) => compareDegradedFallbackCandidates(a, b, fallbackConfig.reasonRankByReason));
    return candidates[0] || null;
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
        agent?.metrics,
        {
            samples: agent?.sampleSize ?? agent?.samples,
            successRate: agent?.successRate,
            timeoutRate: agent?.timeoutRate,
            failureRate: agent?.failureRate,
            avgLatencyMs: agent?.avgLatencyMs,
            p95LatencyMs: agent?.p95LatencyMs
        }
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


function scoreLoadPenalty(load, context) {
    const clampedLoad = clamp(load, 0, 1);
    const basePenalty = clampedLoad * context.loadPenaltyWeight;
    const softCap = clamp(context.loadSoftCap, 0, 1);

    if (clampedLoad <= softCap || softCap >= 1) {
        return Number(basePenalty.toFixed(4));
    }

    const overageRatio = (clampedLoad - softCap) / Math.max(1 - softCap, SCORE_EPSILON);
    const surgePenalty = (overageRatio ** context.loadSurgeExponent) * context.loadPenaltyWeight;

    const criticalThreshold = clamp(context.loadCriticalThreshold, 0, 1);
    const criticalPenalty = clampedLoad > criticalThreshold && criticalThreshold < 1
        ? (((clampedLoad - criticalThreshold) / Math.max(1 - criticalThreshold, SCORE_EPSILON)) ** 2)
            * context.loadPenaltyWeight
            * context.loadCriticalMultiplier
        : 0;

    return Number((basePenalty + surgePenalty + criticalPenalty).toFixed(4));
}

function scoreStalenessPenalty(heartbeat, context) {
    if (heartbeat?.state === 'missing') {
        return Number(context.missingHeartbeatPenalty.toFixed(4));
    }

    if (!Number.isFinite(heartbeat?.stalenessMs)) {
        return 0;
    }

    const stalenessRatio = clamp(heartbeat.stalenessMs / context.maxStalenessMs, 0, 1);
    const basePenalty = stalenessRatio * context.stalenessPenaltyWeight;
    const softRatio = clamp(context.stalenessSoftRatio, 0, 1);

    if (stalenessRatio <= softRatio || softRatio >= 1) {
        return Number(basePenalty.toFixed(4));
    }

    const overageRatio = (stalenessRatio - softRatio) / Math.max(1 - softRatio, SCORE_EPSILON);
    const surgePenalty = (overageRatio ** context.stalenessSurgeExponent) * context.stalenessPenaltyWeight;

    const criticalRatio = clamp(context.stalenessCriticalRatio, 0, 1);
    const criticalPenalty = stalenessRatio > criticalRatio && criticalRatio < 1
        ? (((stalenessRatio - criticalRatio) / Math.max(1 - criticalRatio, SCORE_EPSILON)) ** 2)
            * context.stalenessPenaltyWeight
            * context.stalenessCriticalMultiplier
        : 0;

    return Number((basePenalty + surgePenalty + criticalPenalty).toFixed(4));
}

function scoreReliabilityPenalty(stats, context) {
    if (!stats?.hasAny) {
        return 0;
    }

    const thresholds = context.benchmarkThresholds;
    const reliabilityFloor = Math.max(thresholds.minSuccessRate, SCORE_EPSILON);
    const failureFloor = Math.max(thresholds.maxFailureRate, SCORE_EPSILON);
    const timeoutFloor = Math.max(thresholds.maxTimeoutRate, SCORE_EPSILON);
    const combinedFloor = Math.max(
        thresholds.maxFailureRate + thresholds.maxTimeoutRate,
        SCORE_EPSILON
    );

    const sampleRatio = stats.samples === null
        ? 0
        : clamp(stats.samples / context.minSamplesForFullConfidence, 0, 1);
    const lowSampleMultiplier = 1 + ((1 - sampleRatio) * context.lowSampleOverageMultiplier);

    const failurePenalty = stats.failureRate === null
        ? 0
        : stats.failureRate * context.failurePenaltyWeight;
    const timeoutPenalty = stats.timeoutRate === null
        ? 0
        : stats.timeoutRate * context.timeoutPenaltyWeight;

    const failureOveragePenalty = stats.failureRate !== null && stats.failureRate > thresholds.maxFailureRate
        ? ((stats.failureRate - thresholds.maxFailureRate) / failureFloor)
            * context.failurePenaltyWeight
            * context.reliabilityOverageMultiplier
            * lowSampleMultiplier
        : 0;
    const timeoutOveragePenalty = stats.timeoutRate !== null && stats.timeoutRate > thresholds.maxTimeoutRate
        ? ((stats.timeoutRate - thresholds.maxTimeoutRate) / timeoutFloor)
            * context.timeoutPenaltyWeight
            * context.reliabilityOverageMultiplier
            * lowSampleMultiplier
        : 0;

    const successDeficitRatio = stats.successRate !== null && stats.successRate < thresholds.minSuccessRate
        ? (thresholds.minSuccessRate - stats.successRate) / reliabilityFloor
        : 0;
    const successDeficitPenalty = successDeficitRatio > 0
        ? (successDeficitRatio ** 1.35)
            * (context.failurePenaltyWeight + context.timeoutPenaltyWeight)
            * 0.5
            * context.reliabilityOverageMultiplier
            * lowSampleMultiplier
        : 0;

    const combinedErrorRate = (stats.failureRate || 0) + (stats.timeoutRate || 0);
    const combinedErrorPenalty = combinedErrorRate > combinedFloor
        ? ((combinedErrorRate - combinedFloor) / combinedFloor)
            * (context.failurePenaltyWeight + context.timeoutPenaltyWeight)
            * 0.65
            * context.reliabilityOverageMultiplier
            * lowSampleMultiplier
        : 0;

    const interactionPenalty = stats.failureRate !== null && stats.timeoutRate !== null
        ? (stats.failureRate * stats.timeoutRate)
            * (context.failurePenaltyWeight + context.timeoutPenaltyWeight)
            * 0.35
        : 0;

    return Number((
        failurePenalty
        + timeoutPenalty
        + failureOveragePenalty
        + timeoutOveragePenalty
        + successDeficitPenalty
        + combinedErrorPenalty
        + interactionPenalty
    ).toFixed(4));
}

function scoreTimeoutPressurePenalty(stats, context) {
    if (!stats?.hasAny) {
        return 0;
    }

    let timeoutPenalty = 0;

    if (stats.timeoutRate !== null) {
        const timeoutFloor = Math.max(context.benchmarkThresholds.maxTimeoutRate, SCORE_EPSILON);
        const timeoutRatio = clamp(stats.timeoutRate / timeoutFloor, 0, 3);
        const triggerRatio = clamp(context.timeoutPressureTriggerRatio, 0, 1);

        if (timeoutRatio > triggerRatio) {
            const overageRatio = (timeoutRatio - triggerRatio) / Math.max(1 - triggerRatio, SCORE_EPSILON);
            timeoutPenalty += (overageRatio ** context.timeoutPressureExponent) * context.timeoutPressureWeight;
        } else {
            timeoutPenalty += (timeoutRatio ** 1.35) * context.timeoutPressureWeight * 0.32;
        }

        if (timeoutRatio > 1) {
            const spikeRatio = timeoutRatio - 1;
            timeoutPenalty += (spikeRatio ** (context.timeoutPressureExponent + 0.25))
                * context.timeoutPressureWeight
                * 0.55;
        }
    }

    let p95Penalty = 0;

    if (stats.p95LatencyMs !== null) {
        const p95Floor = Math.max(context.benchmarkThresholds.maxP95LatencyMs, SCORE_EPSILON);
        const p95Ratio = clamp(stats.p95LatencyMs / p95Floor, 0, 3);
        const p95TriggerRatio = clamp(context.p95TimeoutPressureTriggerRatio, 0, 1);

        if (p95Ratio > p95TriggerRatio) {
            const overageRatio = (p95Ratio - p95TriggerRatio) / Math.max(1 - p95TriggerRatio, SCORE_EPSILON);
            p95Penalty += (overageRatio ** context.p95TimeoutPressureExponent) * context.p95TimeoutPressureWeight;
        }
    }

    const sampleConfidence = stats.samples === null
        ? 0.35
        : clamp(stats.samples / context.timeoutPressureFullConfidenceSamples, 0, 1);
    const confidenceMultiplier = 0.85 + ((1 - sampleConfidence) * 0.45);

    return Number(((timeoutPenalty + p95Penalty) * confidenceMultiplier).toFixed(4));
}


function evaluateReliabilityFloor(stats, priority, context) {
    if (!stats?.hasAny) {
        return {
            blocked: false,
            reason: null,
            severity: 0
        };
    }

    const sampleCount = Number.isFinite(stats.samples) ? Math.max(0, Number(stats.samples)) : 0;
    if (sampleCount < context.reliabilityFloorMinSamples) {
        return {
            blocked: false,
            reason: null,
            severity: 0
        };
    }

    const thresholds = context.benchmarkThresholds;
    const overageRatio = Math.max(context.reliabilityFloorOverageRatio, 1);
    const combinedFloor = Math.max(thresholds.maxFailureRate + thresholds.maxTimeoutRate, SCORE_EPSILON);

    const successBelowFloor = stats.successRate !== null && stats.successRate < thresholds.minSuccessRate;
    const timeoutAboveFloor = stats.timeoutRate !== null && stats.timeoutRate > thresholds.maxTimeoutRate;
    const failureAboveFloor = stats.failureRate !== null && stats.failureRate > thresholds.maxFailureRate;

    const severeSuccessDrop = stats.successRate !== null
        && stats.successRate < (thresholds.minSuccessRate * context.reliabilityFloorSuccessRatio);
    const severeTimeoutBreach = stats.timeoutRate !== null
        && stats.timeoutRate > (thresholds.maxTimeoutRate * overageRatio);
    const severeFailureBreach = stats.failureRate !== null
        && stats.failureRate > (thresholds.maxFailureRate * overageRatio);
    const combinedErrorRate = (stats.failureRate || 0) + (stats.timeoutRate || 0);
    const severeCombinedError = combinedErrorRate
        > (combinedFloor * context.reliabilityFloorCombinedErrorMultiplier);

    const successSeverity = stats.successRate !== null && stats.successRate < thresholds.minSuccessRate
        ? (thresholds.minSuccessRate - stats.successRate) / Math.max(thresholds.minSuccessRate, SCORE_EPSILON)
        : 0;
    const timeoutSeverity = stats.timeoutRate !== null && stats.timeoutRate > thresholds.maxTimeoutRate
        ? (stats.timeoutRate - thresholds.maxTimeoutRate) / Math.max(thresholds.maxTimeoutRate, SCORE_EPSILON)
        : 0;
    const failureSeverity = stats.failureRate !== null && stats.failureRate > thresholds.maxFailureRate
        ? (stats.failureRate - thresholds.maxFailureRate) / Math.max(thresholds.maxFailureRate, SCORE_EPSILON)
        : 0;
    const combinedSeverity = combinedErrorRate > combinedFloor
        ? (combinedErrorRate - combinedFloor) / combinedFloor
        : 0;

    const strictPriority = priority === 'critical' || priority === 'high';
    const blocked = strictPriority
        ? (successBelowFloor || timeoutAboveFloor || failureAboveFloor)
        : (severeSuccessDrop || severeTimeoutBreach || severeFailureBreach || severeCombinedError);

    return {
        blocked,
        reason: blocked ? 'reliability_floor_breach' : null,
        severity: Number(Math.max(successSeverity, timeoutSeverity, failureSeverity, combinedSeverity).toFixed(4))
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

function scoreMissingHeartbeatPriorityPenalty(heartbeat, priority, context) {
    if (heartbeat?.state !== 'missing') {
        return 0;
    }

    const multiplier = priority === 'critical'
        ? 2.5
        : priority === 'high'
            ? 1.6
            : priority === 'low'
                ? 0.8
                : 1;

    return Number((context.missingHeartbeatPenalty * Math.max(multiplier - 1, 0)).toFixed(4));
}

function scoreAgent(taskRequest, agent, context) {
    if (!agent || typeof agent !== 'object') {
        return {
            eligible: false,
            score: -Infinity,
            reason: 'invalid_agent',
            benchmarkConfidence: 0,
            timeoutPressurePenalty: 0
        };
    }

    const status = typeof agent.status === 'string' ? agent.status : 'offline';
    if (!HEALTHY_STATUSES.has(status)) {
        return {
            eligible: false,
            score: -Infinity,
            reason: `status_${status}`,
            benchmarkConfidence: 0,
            timeoutPressurePenalty: 0
        };
    }

    const load = Number.isFinite(Number(agent.load))
        ? Math.max(0, Math.min(1, Number(agent.load)))
        : 0.5;
    const routingPolicy = context.routingPolicy;
    const priority = normalizePriority(taskRequest.priority);
    if (priority !== 'critical' && load >= routingPolicy.overloadThreshold) {
        return {
            eligible: false,
            score: -Infinity,
            reason: 'load_shed',
            missingCapabilities: [],
            benchmarkConfidence: 0,
            timeoutPressurePenalty: 0
        };
    }

    const routingHints = normalizeRoutingHints(agent);
    if (context.nowMs < routingHints.cooldownUntilMs) {
        return {
            eligible: false,
            score: -Infinity,
            reason: 'circuit_open',
            missingCapabilities: [],
            benchmarkConfidence: 0,
            timeoutPressurePenalty: 0
        };
    }

    const capabilities = normalizeCapabilities(agent.capabilities);
    const requiredCapabilities = extractRequiredCapabilities(taskRequest);
    const missingCapabilities = requiredCapabilities.filter((capability) => !capabilities.includes(capability));
    if (missingCapabilities.length > 0) {
        return {
            eligible: false,
            score: -Infinity,
            reason: 'missing_capabilities',
            missingCapabilities,
            benchmarkConfidence: 0,
            timeoutPressurePenalty: 0
        };
    }

    const benchmarkStats = resolveBenchmarkStats(agent, context);
    const benchmark = scoreBenchmark(benchmarkStats, context);
    const reliabilityPenalty = scoreReliabilityPenalty(benchmarkStats, context);
    const timeoutPressurePenalty = scoreTimeoutPressurePenalty(benchmarkStats, context);
    const reliabilityFloor = evaluateReliabilityFloor(benchmarkStats, priority, context);

    const heartbeat = evaluateHeartbeat(agent, context);
    if (!heartbeat.eligible) {
        return {
            eligible: false,
            score: -Infinity,
            reason: heartbeat.reason,
            missingCapabilities: [],
            benchmarkConfidence: benchmark.confidence,
            benchmarkAdjustment: benchmark.adjustment,
            reliabilityPenalty,
            timeoutPressurePenalty,
            reliabilityFloorSeverity: reliabilityFloor.severity,
            heartbeatStalenessMs: heartbeat.stalenessMs
        };
    }

    if (reliabilityFloor.blocked) {
        return {
            eligible: false,
            score: -Infinity,
            reason: reliabilityFloor.reason,
            missingCapabilities: [],
            benchmarkConfidence: benchmark.confidence,
            benchmarkAdjustment: benchmark.adjustment,
            reliabilityPenalty,
            timeoutPressurePenalty,
            reliabilityFloorSeverity: reliabilityFloor.severity,
            heartbeatStalenessMs: heartbeat.stalenessMs
        };
    }

    let score = 100;

    const loadPenalty = scoreLoadPenalty(load, context);
    score -= loadPenalty;

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

    const stalenessPenalty = scoreStalenessPenalty(heartbeat, context);
    score -= stalenessPenalty;

    const missingHeartbeatPriorityPenalty = scoreMissingHeartbeatPriorityPenalty(heartbeat, priority, context);
    score -= missingHeartbeatPriorityPenalty;

    score -= reliabilityPenalty;

    score -= timeoutPressurePenalty;

    score += benchmark.adjustment;

    if (routingHints.attempts >= routingPolicy.minSamplesForReliability) {
        score += (routingHints.successRate - 0.5) * 40;
    }

    if (routingHints.consecutiveFailures > 0) {
        score -= Math.min(30, routingHints.consecutiveFailures * 8);
    }

    if (Number.isFinite(routingHints.ewmaLatencyMs) && routingHints.ewmaLatencyMs > routingPolicy.latencyPenaltyStartMs) {
        const penaltyRange = Math.max(1, routingPolicy.latencyPenaltyCapMs - routingPolicy.latencyPenaltyStartMs);
        const normalizedLatencyPenalty = clamp(
            (routingHints.ewmaLatencyMs - routingPolicy.latencyPenaltyStartMs) / penaltyRange,
            0,
            1
        );
        score -= normalizedLatencyPenalty * 20;
    }

    return {
        eligible: true,
        score: Number(score.toFixed(4)),
        reason: 'ok',
        missingCapabilities: [],
        benchmarkConfidence: benchmark.confidence,
        benchmarkAdjustment: benchmark.adjustment,
        loadPenalty,
        stalenessPenalty,
        missingHeartbeatPriorityPenalty,
        reliabilityPenalty,
        timeoutPressurePenalty,
        heartbeatStalenessMs: heartbeat.stalenessMs,
        routingHints
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
        minSamplesForFullConfidence: resolvePositiveOption(options.minSamplesForFullConfidence, 20),
        loadPenaltyWeight: resolveNonNegativeOption(options.loadPenaltyWeight, DEFAULT_LOAD_PENALTY_WEIGHT),
        stalenessPenaltyWeight: resolveNonNegativeOption(options.stalenessPenaltyWeight, DEFAULT_STALENESS_PENALTY_WEIGHT),
        missingHeartbeatPenalty: resolveNonNegativeOption(options.missingHeartbeatPenalty, DEFAULT_MISSING_HEARTBEAT_PENALTY),
        failurePenaltyWeight: resolveNonNegativeOption(options.failurePenaltyWeight, DEFAULT_FAILURE_PENALTY_WEIGHT),
        timeoutPenaltyWeight: resolveNonNegativeOption(options.timeoutPenaltyWeight, DEFAULT_TIMEOUT_PENALTY_WEIGHT),
        loadSoftCap: resolveUnitIntervalOption(options.loadSoftCap, DEFAULT_LOAD_SOFT_CAP),
        stalenessSoftRatio: resolveUnitIntervalOption(options.stalenessSoftRatio, DEFAULT_STALENESS_SOFT_RATIO),
        reliabilityOverageMultiplier: resolveNonNegativeOption(
            options.reliabilityOverageMultiplier,
            DEFAULT_RELIABILITY_OVERAGE_MULTIPLIER
        ),
        loadSurgeExponent: resolvePositiveOption(options.loadSurgeExponent, DEFAULT_LOAD_SURGE_EXPONENT),
        stalenessSurgeExponent: resolvePositiveOption(options.stalenessSurgeExponent, DEFAULT_STALENESS_SURGE_EXPONENT),
        loadCriticalThreshold: resolveUnitIntervalOption(options.loadCriticalThreshold, DEFAULT_LOAD_CRITICAL_THRESHOLD),
        stalenessCriticalRatio: resolveUnitIntervalOption(options.stalenessCriticalRatio, DEFAULT_STALENESS_CRITICAL_RATIO),
        loadCriticalMultiplier: resolveNonNegativeOption(options.loadCriticalMultiplier, DEFAULT_LOAD_CRITICAL_MULTIPLIER),
        stalenessCriticalMultiplier: resolveNonNegativeOption(
            options.stalenessCriticalMultiplier,
            DEFAULT_STALENESS_CRITICAL_MULTIPLIER
        ),
        lowSampleOverageMultiplier: resolveNonNegativeOption(
            options.lowSampleOverageMultiplier,
            DEFAULT_LOW_SAMPLE_OVERAGE_MULTIPLIER
        ),
        reliabilityFloorMinSamples: resolvePositiveOption(
            options.reliabilityFloorMinSamples,
            DEFAULT_RELIABILITY_FLOOR_MIN_SAMPLES
        ),
        reliabilityFloorSuccessRatio: resolveUnitIntervalOption(
            options.reliabilityFloorSuccessRatio,
            DEFAULT_RELIABILITY_FLOOR_SUCCESS_RATIO
        ),
        reliabilityFloorOverageRatio: resolvePositiveOption(
            options.reliabilityFloorOverageRatio,
            DEFAULT_RELIABILITY_FLOOR_OVERAGE_RATIO
        ),
        reliabilityFloorCombinedErrorMultiplier: resolvePositiveOption(
            options.reliabilityFloorCombinedErrorMultiplier,
            DEFAULT_RELIABILITY_FLOOR_COMBINED_ERROR_MULTIPLIER
        ),
        timeoutPressureWeight: resolveNonNegativeOption(
            options.timeoutPressureWeight,
            DEFAULT_TIMEOUT_PRESSURE_WEIGHT
        ),
        timeoutPressureTriggerRatio: resolveUnitIntervalOption(
            options.timeoutPressureTriggerRatio,
            DEFAULT_TIMEOUT_PRESSURE_TRIGGER_RATIO
        ),
        timeoutPressureExponent: resolvePositiveOption(
            options.timeoutPressureExponent,
            DEFAULT_TIMEOUT_PRESSURE_EXPONENT
        ),
        timeoutPressureFullConfidenceSamples: resolvePositiveOption(
            options.timeoutPressureFullConfidenceSamples,
            DEFAULT_TIMEOUT_PRESSURE_FULL_CONFIDENCE_SAMPLES
        ),
        p95TimeoutPressureWeight: resolveNonNegativeOption(
            options.p95TimeoutPressureWeight,
            DEFAULT_P95_TIMEOUT_PRESSURE_WEIGHT
        ),
        p95TimeoutPressureTriggerRatio: resolveUnitIntervalOption(
            options.p95TimeoutPressureTriggerRatio,
            DEFAULT_P95_TIMEOUT_PRESSURE_TRIGGER_RATIO
        ),
        p95TimeoutPressureExponent: resolvePositiveOption(
            options.p95TimeoutPressureExponent,
            DEFAULT_P95_TIMEOUT_PRESSURE_EXPONENT
        ),
        routingPolicy: normalizeRoutingPolicy(options)
    };
}

function compareRankedAgents(a, b) {
    if (a.eligible !== b.eligible) {
        return a.eligible ? -1 : 1;
    }

    const scoreCompare = compareNumberDescending(a.score, b.score);
    if (scoreCompare !== 0) {
        return scoreCompare;
    }

    const confidenceCompare = compareNumberDescending(a.benchmarkConfidence, b.benchmarkConfidence);
    if (confidenceCompare !== 0) {
        return confidenceCompare;
    }

    if (!a.eligible && !b.eligible) {
        const reasonCompare = compareText(a.reason || '', b.reason || '');
        if (reasonCompare !== 0) {
            return reasonCompare;
        }

        const missingCapsA = normalizeCapabilities(a.missingCapabilities).sort((x, y) => compareText(x, y)).join(',');
        const missingCapsB = normalizeCapabilities(b.missingCapabilities).sort((x, y) => compareText(x, y)).join(',');
        const missingCapsCompare = compareText(missingCapsA, missingCapsB);
        if (missingCapsCompare !== 0) {
            return missingCapsCompare;
        }
    }

    const statusRankA = a.status === 'idle' ? 2 : a.status === 'busy' ? 1 : 0;
    const statusRankB = b.status === 'idle' ? 2 : b.status === 'busy' ? 1 : 0;
    const statusCompare = compareNumberDescending(statusRankA, statusRankB, 0);
    if (statusCompare !== 0) {
        return statusCompare;
    }

    const reliabilityPenaltyCompare = compareNumberAscending(a.reliabilityPenalty, b.reliabilityPenalty);
    if (reliabilityPenaltyCompare !== 0) {
        return reliabilityPenaltyCompare;
    }

    const timeoutPressureCompare = compareNumberAscending(a.timeoutPressurePenalty, b.timeoutPressurePenalty);
    if (timeoutPressureCompare !== 0) {
        return timeoutPressureCompare;
    }

    const missingPenaltyCompare = compareNumberAscending(
        a.missingHeartbeatPriorityPenalty,
        b.missingHeartbeatPriorityPenalty
    );
    if (missingPenaltyCompare !== 0) {
        return missingPenaltyCompare;
    }

    const loadPenaltyCompare = compareNumberAscending(a.loadPenalty, b.loadPenalty);
    if (loadPenaltyCompare !== 0) {
        return loadPenaltyCompare;
    }

    const stalenessPenaltyCompare = compareNumberAscending(a.stalenessPenalty, b.stalenessPenalty);
    if (stalenessPenaltyCompare !== 0) {
        return stalenessPenaltyCompare;
    }

    const loadA = Number.isFinite(Number(a.load)) ? Number(a.load) : 1;
    const loadB = Number.isFinite(Number(b.load)) ? Number(b.load) : 1;
    const loadCompare = compareNumberAscending(loadA, loadB);
    if (loadCompare !== 0) {
        return loadCompare;
    }

    const stalenessA = Number.isFinite(a.heartbeatStalenessMs)
        ? a.heartbeatStalenessMs
        : Number.POSITIVE_INFINITY;
    const stalenessB = Number.isFinite(b.heartbeatStalenessMs)
        ? b.heartbeatStalenessMs
        : Number.POSITIVE_INFINITY;
    const stalenessCompare = compareNumberAscending(stalenessA, stalenessB);
    if (stalenessCompare !== 0) {
        return stalenessCompare;
    }

    const capabilityCountA = Array.isArray(a.capabilities) ? a.capabilities.length : 0;
    const capabilityCountB = Array.isArray(b.capabilities) ? b.capabilities.length : 0;
    const capabilityCompare = compareNumberDescending(capabilityCountA, capabilityCountB, 0);
    if (capabilityCompare !== 0) {
        return capabilityCompare;
    }

    const idA = typeof a.agentId === 'string' ? a.agentId : '';
    const idB = typeof b.agentId === 'string' ? b.agentId : '';
    const idCompare = compareText(idA, idB);
    if (idCompare !== 0) {
        return idCompare;
    }

    const tieBreakKeyCompare = compareText(a._tieBreakKey || '', b._tieBreakKey || '');
    if (tieBreakKeyCompare !== 0) {
        return tieBreakKeyCompare;
    }

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
            const candidate = {
                agentId: getAgentId(agent),
                status: agent?.status,
                load: agent?.load,
                capabilities: normalizeCapabilities(agent?.capabilities),
                ...evaluation,
                _sortIndex: index
            };

            return {
                ...candidate,
                _tieBreakKey: buildTieBreakKey(candidate)
            };
        })
        .sort(compareRankedAgents)
        .map(({ _sortIndex, _tieBreakKey, ...candidate }) => candidate);
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

    if (selection.selectedAgentId) {
        return {
            routed: true,
            selectedAgentId: selection.selectedAgentId,
            ranked: selection.ranked,
            fallbackUsed: false,
            fallbackReason: null,
            taskRequest: {
                ...taskRequest,
                target: selection.selectedAgentId
            }
        };
    }

    const fallbackCandidate = options?.allowDegradedFallback === true
        ? selectDegradedFallbackCandidate(taskRequest, selection.ranked, options)
        : null;

    if (fallbackCandidate) {
        return {
            routed: true,
            selectedAgentId: fallbackCandidate.agentId,
            ranked: selection.ranked,
            fallbackUsed: true,
            fallbackReason: fallbackCandidate.reason || 'degraded_fallback',
            taskRequest: {
                ...taskRequest,
                target: fallbackCandidate.agentId
            }
        };
    }

    return {
        routed: false,
        taskRequest,
        selectedAgentId: null,
        ranked: selection.ranked,
        fallbackUsed: false,
        fallbackReason: null
    };
}
