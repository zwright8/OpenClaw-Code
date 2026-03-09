import { TaskRequest } from './schemas.js';

const HEALTHY_STATUSES = new Set(['idle', 'busy']);
const DEFAULT_STALE_HEARTBEAT_PENALTY = 35;
const DEFAULT_PANIC_HEALTHY_RATIO_THRESHOLD = 0.5;
const DEFAULT_OUTLIER_CONSECUTIVE_FAILURE_THRESHOLD = 5;
const DEFAULT_OUTLIER_SUCCESS_RATE_THRESHOLD = 0.5;
const DEFAULT_OUTLIER_MIN_SAMPLES = 20;
const DEFAULT_OUTLIER_BASE_EJECTION_MS = 30_000;
const DEFAULT_OUTLIER_MAX_EJECTION_MS = 300_000;
const DEFAULT_OUTLIER_PENALTY = 45;
const DEFAULT_OVERLOAD_PENALTY = 40;
const DEFAULT_SLOW_START_WINDOW_MS = 60_000;
const DEFAULT_SLOW_START_MIN_WEIGHT = 0.15;
const DEFAULT_ADAPTIVE_SATURATION_PENALTY = 35;
const DEFAULT_ADAPTIVE_LATENCY_PENALTY = 20;
const DEFAULT_ADAPTIVE_QUEUEING_TARGET_MULTIPLIER = 1.5;
const DEFAULT_LOCAL_ZONE_BOOST = 18;
const DEFAULT_CROSS_ZONE_PENALTY = 10;
const DEFAULT_PREFERRED_ZONE_BOOST = 8;
const DEFAULT_HEDGE_DELAY_MS = 75;
const DEFAULT_HEDGE_SCORE_DELTA = 12;
const DEFAULT_HEDGE_MAX_CANDIDATES = 1;
const DEFAULT_HEDGE_MIN_CANDIDATE_SCORE = 40;
const DEFAULT_HEDGE_MAX_CANDIDATE_LOAD = 0.85;
const DEFAULT_ADMISSION_AVERAGE_LOAD_THRESHOLD = 0.8;
const DEFAULT_ADMISSION_HEALTHY_RATIO_THRESHOLD = 0.4;
const DEFAULT_ADMISSION_SATURATION_RATIO_THRESHOLD = 0.5;
const DEFAULT_UCB_EXPLORATION_COEFFICIENT = 0.65;
const LOCALITY_FALLBACK_MODES = new Set(['cluster', 'strict']);
const VALID_TASK_PRIORITIES = new Set(['low', 'normal', 'high', 'critical']);

function normalizeCapabilities(value) {
    if (!Array.isArray(value)) return [];
    return [...new Set(value
        .filter((item) => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
    )];
}

function normalizeString(value) {
    return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function normalizeStringList(value) {
    if (!Array.isArray(value)) return [];
    return [...new Set(value.map((entry) => normalizeString(entry)).filter(Boolean))];
}

function extractRequiredCapabilities(taskRequest) {
    const required = taskRequest?.context?.requiredCapabilities;
    return normalizeCapabilities(required);
}

function clampLoad(value, fallback = 0.5) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return Math.max(0, Math.min(1, numeric));
}

function safeInteger(value, fallback = 0) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return Math.max(0, Math.floor(numeric));
}

function safeProbability(value, fallback = null) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return Math.max(0, Math.min(1, numeric));
}

function safeNonNegativeNumber(value, fallback = 0) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric < 0) return fallback;
    return numeric;
}

function normalizeOutlierOptions(options = {}) {
    const configured = options?.outlierDetection;
    const enabled = configured?.enabled === true;
    return {
        enabled,
        enforce: configured?.enforce !== false,
        consecutiveFailureThreshold: Math.max(
            1,
            safeInteger(configured?.consecutiveFailureThreshold, DEFAULT_OUTLIER_CONSECUTIVE_FAILURE_THRESHOLD)
        ),
        successRateThreshold: safeProbability(configured?.successRateThreshold, DEFAULT_OUTLIER_SUCCESS_RATE_THRESHOLD),
        minSamples: Math.max(1, safeInteger(configured?.minSamples, DEFAULT_OUTLIER_MIN_SAMPLES)),
        baseEjectionMs: Math.max(1, safeInteger(configured?.baseEjectionMs, DEFAULT_OUTLIER_BASE_EJECTION_MS)),
        maxEjectionMs: Math.max(1, safeInteger(configured?.maxEjectionMs, DEFAULT_OUTLIER_MAX_EJECTION_MS)),
        penalty: Math.max(0, Number(configured?.penalty ?? DEFAULT_OUTLIER_PENALTY))
    };
}

function normalizeOverloadProtectionOptions(options = {}) {
    const configured = options?.overloadProtection;
    const enabled = configured?.enabled === true;
    return {
        enabled,
        enforce: configured?.enforce !== false,
        penalty: Math.max(0, Number(configured?.penalty ?? DEFAULT_OVERLOAD_PENALTY))
    };
}

function normalizeSlowStartOptions(options = {}) {
    const configured = options?.slowStart;
    const enabled = configured?.enabled === true;
    const windowMs = Math.max(1, safeInteger(configured?.windowMs, DEFAULT_SLOW_START_WINDOW_MS));
    const minWeight = safeProbability(configured?.minWeight, DEFAULT_SLOW_START_MIN_WEIGHT);
    return {
        enabled,
        windowMs,
        minWeight
    };
}

function normalizeAdaptiveConcurrencyOptions(options = {}) {
    const configured = options?.adaptiveConcurrency;
    const enabled = configured?.enabled === true;
    return {
        enabled,
        enforce: configured?.enforce === true,
        saturationPenalty: Math.max(0, Number(configured?.saturationPenalty ?? DEFAULT_ADAPTIVE_SATURATION_PENALTY)),
        latencyPenalty: Math.max(0, Number(configured?.latencyPenalty ?? DEFAULT_ADAPTIVE_LATENCY_PENALTY)),
        queueingTargetMultiplier: Math.max(
            1,
            Number(configured?.queueingTargetMultiplier ?? DEFAULT_ADAPTIVE_QUEUEING_TARGET_MULTIPLIER)
        )
    };
}

function normalizeZoneWeights(value) {
    if (!value || typeof value !== 'object') return {};
    const normalized = {};
    for (const [zone, weight] of Object.entries(value)) {
        const key = normalizeString(zone);
        const numeric = Number(weight);
        if (!key || !Number.isFinite(numeric)) continue;
        normalized[key] = numeric;
    }
    return normalized;
}

function normalizeLocalityOptions(taskRequest, options = {}) {
    const routing = taskRequest?.context?.routing && typeof taskRequest.context.routing === 'object'
        ? taskRequest.context.routing
        : {};
    const routingPreferences = taskRequest?.context?.routingPreferences && typeof taskRequest.context.routingPreferences === 'object'
        ? taskRequest.context.routingPreferences
        : {};
    const configured = options?.locality && typeof options.locality === 'object'
        ? options.locality
        : {};

    const fallbackValue = normalizeString(
        configured.fallbackMode
        ?? routing.localityFallback
        ?? routingPreferences.localityFallback
    );
    const fallbackMode = LOCALITY_FALLBACK_MODES.has(fallbackValue) ? fallbackValue : 'cluster';

    const clientZone = normalizeString(
        configured.clientZone
        ?? routing.clientZone
        ?? routing.zone
        ?? routingPreferences.clientZone
    );
    const preferredZones = normalizeStringList(
        configured.preferredZones
        ?? routing.preferredZones
        ?? routing.preferZones
        ?? routingPreferences.preferredZones
    );
    const strictZoneAffinity = Boolean(
        configured.strictZoneAffinity
        ?? routing.strictZoneAffinity
        ?? routingPreferences.strictZoneAffinity
    );

    return {
        enabled: configured.enabled === true || Boolean(clientZone) || preferredZones.length > 0 || strictZoneAffinity,
        clientZone,
        preferredZones,
        strictZoneAffinity,
        fallbackMode,
        localZoneBoost: Math.max(0, Number(configured.localZoneBoost ?? DEFAULT_LOCAL_ZONE_BOOST)),
        crossZonePenalty: Math.max(0, Number(configured.crossZonePenalty ?? DEFAULT_CROSS_ZONE_PENALTY)),
        preferredZoneBoost: Math.max(0, Number(configured.preferredZoneBoost ?? DEFAULT_PREFERRED_ZONE_BOOST)),
        zoneWeights: normalizeZoneWeights(
            configured.zoneWeights
            ?? routing.zoneWeights
            ?? routingPreferences.zoneWeights
        )
    };
}

function normalizeHedgingOptions(taskRequest, options = {}) {
    const routing = taskRequest?.context?.routing && typeof taskRequest.context.routing === 'object'
        ? taskRequest.context.routing
        : {};
    const configured = options?.hedging && typeof options.hedging === 'object'
        ? options.hedging
        : {};

    const priorities = normalizeStringList(
        configured.priorities
        ?? routing.hedgePriorities
        ?? ['high', 'critical']
    ).filter((priority) => ['low', 'normal', 'high', 'critical'].includes(priority));

    return {
        enabled: configured.enabled === true || routing.enableHedging === true,
        delayMs: Math.max(0, safeInteger(configured.delayMs ?? routing.hedgeDelayMs, DEFAULT_HEDGE_DELAY_MS)),
        scoreDelta: Math.max(0, Number(configured.scoreDelta ?? routing.hedgeScoreDelta ?? DEFAULT_HEDGE_SCORE_DELTA)),
        maxCandidates: Math.max(
            1,
            safeInteger(configured.maxCandidates ?? routing.maxHedgeCandidates, DEFAULT_HEDGE_MAX_CANDIDATES)
        ),
        minCandidateScore: Number(
            configured.minCandidateScore
            ?? routing.minHedgeCandidateScore
            ?? DEFAULT_HEDGE_MIN_CANDIDATE_SCORE
        ),
        maxCandidateLoad: Math.max(
            0,
            Math.min(
                1,
                Number(configured.maxCandidateLoad ?? routing.maxHedgeCandidateLoad ?? DEFAULT_HEDGE_MAX_CANDIDATE_LOAD)
            )
        ),
        requireDifferentZone: configured.requireDifferentZone === true || routing.hedgeDifferentZone === true,
        priorities
    };
}

function normalizeAdmissionControlOptions(taskRequest, options = {}) {
    const routing = taskRequest?.context?.routing && typeof taskRequest.context.routing === 'object'
        ? taskRequest.context.routing
        : {};
    const configured = options?.admissionControl && typeof options.admissionControl === 'object'
        ? options.admissionControl
        : {};

    const shedPriorities = normalizeStringList(
        configured.shedPriorities
        ?? routing.shedPriorities
        ?? ['low']
    ).filter((priority) => VALID_TASK_PRIORITIES.has(priority));

    return {
        enabled: configured.enabled === true || routing.enableAdmissionControl === true,
        shedPriorities,
        averageLoadThreshold: Math.max(
            0,
            Math.min(1, Number(configured.averageLoadThreshold ?? routing.averageLoadThreshold ?? DEFAULT_ADMISSION_AVERAGE_LOAD_THRESHOLD))
        ),
        healthyRatioThreshold: Math.max(
            0,
            Math.min(1, Number(configured.healthyRatioThreshold ?? routing.healthyRatioThreshold ?? DEFAULT_ADMISSION_HEALTHY_RATIO_THRESHOLD))
        ),
        saturationRatioThreshold: Math.max(
            0,
            Math.min(
                1,
                Number(configured.saturationRatioThreshold ?? routing.saturationRatioThreshold ?? DEFAULT_ADMISSION_SATURATION_RATIO_THRESHOLD)
            )
        )
    };
}

function extractAgentZone(agent) {
    return normalizeString(
        agent?.routing?.zone
        ?? agent?.locality?.zone
        ?? agent?.zone
        ?? agent?.metadata?.zone
    );
}

function extractOutlierStats(agent) {
    const snapshot = agent?.outlier && typeof agent.outlier === 'object' ? agent.outlier : agent;
    const consecutiveFailures = safeInteger(snapshot?.consecutiveFailures, 0);
    const sampleSize = safeInteger(snapshot?.sampleSize, 0);
    const ejectionCount = safeInteger(snapshot?.ejectionCount, 0);
    const successRate = safeProbability(snapshot?.successRate, null);
    const ejectedUntilMs = Number(snapshot?.ejectedUntilMs);
    return {
        consecutiveFailures,
        successRate,
        sampleSize,
        ejectionCount,
        ejectedUntilMs: Number.isFinite(ejectedUntilMs) ? ejectedUntilMs : null
    };
}

function extractConcurrencyStats(agent) {
    const routing = agent?.routing && typeof agent.routing === 'object' ? agent.routing : {};
    const inFlight = safeInteger(routing.inFlight ?? agent?.inFlight, 0);
    const maxInFlight = safeInteger(routing.maxInFlight ?? agent?.maxInFlight, 0);
    return {
        inFlight,
        maxInFlight
    };
}

function extractAdaptiveRoutingStats(agent) {
    const routing = agent?.routing && typeof agent.routing === 'object' ? agent.routing : {};
    const inFlight = safeInteger(routing.inFlight ?? agent?.inFlight, 0);
    const concurrencyLimit = safeInteger(routing.concurrencyLimit ?? routing.maxInFlight ?? agent?.maxInFlight, 0);
    const minRttMs = Number(routing.minRttMs);
    const sampleRttMs = Number(routing.sampleRttMs);

    return {
        inFlight,
        concurrencyLimit,
        minRttMs: Number.isFinite(minRttMs) && minRttMs > 0 ? minRttMs : null,
        sampleRttMs: Number.isFinite(sampleRttMs) && sampleRttMs > 0 ? sampleRttMs : null
    };
}

function evaluateOverloadState(agent, options = {}) {
    const config = normalizeOverloadProtectionOptions(options);
    if (!config.enabled) return null;

    const concurrency = extractConcurrencyStats(agent);
    if (concurrency.maxInFlight <= 0) return null;
    if (concurrency.inFlight < concurrency.maxInFlight) return null;

    return {
        ...concurrency,
        saturated: true,
        enforce: config.enforce
    };
}

function extractRecoveredAtMs(agent) {
    const routing = agent?.routing && typeof agent.routing === 'object' ? agent.routing : {};
    const candidate = Number(routing.recoveredAtMs ?? agent?.recoveredAtMs);
    return Number.isFinite(candidate) ? candidate : null;
}

function evaluateSlowStartState(agent, nowMs, options = {}) {
    const config = normalizeSlowStartOptions(options);
    if (!config.enabled) return null;

    const recoveredAtMs = extractRecoveredAtMs(agent);
    if (recoveredAtMs === null) return null;
    if (nowMs <= recoveredAtMs) {
        return {
            recoveredAtMs,
            elapsedMs: 0,
            progress: 0,
            weight: Number(config.minWeight.toFixed(4)),
            windowMs: config.windowMs
        };
    }

    const elapsedMs = Math.max(0, nowMs - recoveredAtMs);
    const progress = Math.max(0, Math.min(1, elapsedMs / config.windowMs));
    const weight = config.minWeight + ((1 - config.minWeight) * progress);
    if (progress >= 1) {
        return {
            recoveredAtMs,
            elapsedMs,
            progress: 1,
            weight: 1,
            windowMs: config.windowMs
        };
    }

    return {
        recoveredAtMs,
        elapsedMs,
        progress: Number(progress.toFixed(4)),
        weight: Number(weight.toFixed(4)),
        windowMs: config.windowMs
    };
}

function evaluateOutlierState(agent, nowMs, options = {}) {
    const config = normalizeOutlierOptions(options);
    if (!config.enabled) return null;

    const stats = extractOutlierStats(agent);
    if (stats.ejectedUntilMs !== null && stats.ejectedUntilMs > nowMs) {
        return {
            state: 'ejected',
            ...stats
        };
    }

    const consecutiveFailureTriggered = stats.consecutiveFailures >= config.consecutiveFailureThreshold;
    const successRateTriggered = stats.successRate !== null
        && stats.sampleSize >= config.minSamples
        && stats.successRate < config.successRateThreshold;

    if (!consecutiveFailureTriggered && !successRateTriggered) {
        return null;
    }

    const nextEjectionMs = Math.min(
        config.maxEjectionMs,
        config.baseEjectionMs * Math.max(1, stats.ejectionCount + 1)
    );

    return {
        state: 'detected',
        ...stats,
        consecutiveFailureTriggered,
        successRateTriggered,
        nextEjectionMs,
        suggestedEjectedUntilMs: nowMs + nextEjectionMs,
        enforce: config.enforce
    };
}

function computeBaseScore(taskRequest, {
    load,
    status,
    requiredCapabilities
}) {
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

    return Number(score.toFixed(2));
}

function safeRandom(options) {
    const sample = Number(options?.random?.());
    const value = Number.isFinite(sample) ? sample : Math.random();
    return Math.max(0, Math.min(0.999999999, value));
}

function pickWithPowerOfTwoChoices(eligible, options) {
    if (!Array.isArray(eligible) || eligible.length === 0) return null;
    if (eligible.length === 1) return eligible[0];

    const firstIndex = Math.floor(safeRandom(options) * eligible.length);
    let secondIndex = Math.floor(safeRandom(options) * eligible.length);
    if (secondIndex === firstIndex) {
        secondIndex = (secondIndex + 1) % eligible.length;
    }

    const first = eligible[firstIndex];
    const second = eligible[secondIndex];
    if (second.score > first.score) return second;
    if (second.score < first.score) return first;

    return safeRandom(options) < 0.5 ? first : second;
}

function normalizeUcbOptions(options = {}) {
    const configured = Number(
        options?.selectionExplorationCoefficient
        ?? options?.ucb?.explorationCoefficient
        ?? DEFAULT_UCB_EXPLORATION_COEFFICIENT
    );
    const explorationCoefficient = Number.isFinite(configured)
        ? Math.max(0, configured)
        : DEFAULT_UCB_EXPLORATION_COEFFICIENT;
    return {
        explorationCoefficient
    };
}

function selectWithUcb(eligible, options = {}) {
    if (!Array.isArray(eligible) || eligible.length === 0) return null;
    if (eligible.length === 1) return eligible[0];

    const { explorationCoefficient } = normalizeUcbOptions(options);
    const scored = eligible.filter((item) => Number.isFinite(item.score));
    if (scored.length === 0) return eligible[0];

    let minScore = scored[0].score;
    let maxScore = scored[0].score;
    let totalSelections = 0;
    for (const item of scored) {
        minScore = Math.min(minScore, item.score);
        maxScore = Math.max(maxScore, item.score);
        totalSelections += safeNonNegativeNumber(item.selectionCount, 0);
    }
    const scoreRange = Math.max(1, maxScore - minScore);
    const logTerm = Math.log(Math.max(2, totalSelections + scored.length + 1));

    let best = scored[0];
    let bestUcb = -Infinity;
    for (const item of scored) {
        const selectionCount = safeNonNegativeNumber(item.selectionCount, 0);
        const normalizedReward = (item.score - minScore) / scoreRange;
        const bonus = explorationCoefficient * Math.sqrt(logTerm / (selectionCount + 1));
        const ucb = normalizedReward + bonus;
        if (ucb > bestUcb) {
            bestUcb = ucb;
            best = item;
            continue;
        }

        if (ucb === bestUcb) {
            if (item.score > best.score) {
                best = item;
            } else if (item.score === best.score && safeRandom(options) < 0.5) {
                best = item;
            }
        }
    }

    return best;
}

function pickBestEligible(ranked, options = {}) {
    const eligible = ranked.filter((item) => item.eligible && typeof item.agentId === 'string' && item.agentId.trim());
    if (eligible.length === 0) return null;
    const selectionStrategy = normalizeString(options?.selectionStrategy) || 'greedy';
    if (selectionStrategy === 'p2c') {
        return pickWithPowerOfTwoChoices(eligible, options);
    }
    if (selectionStrategy === 'ucb1') {
        return selectWithUcb(eligible, options);
    }
    return eligible[0];
}

function buildHedgePlan(taskRequest, ranked, selectedAgentId, options = {}) {
    if (!selectedAgentId || !Array.isArray(ranked) || ranked.length === 0) return null;
    const hedging = normalizeHedgingOptions(taskRequest, options);
    if (!hedging.enabled) return null;

    const priority = normalizeString(taskRequest?.priority) || 'normal';
    if (!hedging.priorities.includes(priority)) return null;

    const primary = ranked.find((entry) => entry.agentId === selectedAgentId && entry.eligible);
    if (!primary || !Number.isFinite(primary.score)) return null;

    const minimumScore = primary.score - hedging.scoreDelta;
    const candidates = ranked
        .filter((entry) => entry.eligible && entry.agentId !== selectedAgentId && Number.isFinite(entry.score))
        .filter((entry) => entry.score >= minimumScore && entry.score >= hedging.minCandidateScore)
        .filter((entry) => clampLoad(entry.load, 1) <= hedging.maxCandidateLoad)
        .filter((entry) => {
            if (!hedging.requireDifferentZone) return true;
            if (!primary.zone || !entry.zone) return false;
            return primary.zone !== entry.zone;
        })
        .slice(0, hedging.maxCandidates)
        .map((entry) => ({
            agentId: entry.agentId,
            score: entry.score,
            ...(entry.zone ? { zone: entry.zone } : {})
        }));

    if (candidates.length === 0) return null;
    return {
        enabled: true,
        delayMs: hedging.delayMs,
        candidates
    };
}

function evaluateAdmissionPressure(ranked = [], options = {}) {
    const totalCandidates = ranked.filter((item) => typeof item.agentId === 'string' && item.agentId.trim()).length;
    if (totalCandidates === 0) {
        return {
            overloaded: false,
            totalCandidates: 0,
            healthyCandidates: 0,
            healthyRatio: 0,
            averageLoad: 0,
            saturationRatio: 0
        };
    }

    const healthyCandidates = ranked.filter((item) => item.eligible && typeof item.agentId === 'string' && item.agentId.trim()).length;
    const healthyRatio = healthyCandidates / totalCandidates;
    const totalLoad = ranked
        .filter((item) => typeof item.agentId === 'string' && item.agentId.trim())
        .reduce((sum, item) => sum + clampLoad(item.load, 0.5), 0);
    const averageLoad = totalLoad / totalCandidates;
    const saturationSignals = ranked.filter((item) => item.reason === 'concurrency_saturated' || item.reason === 'adaptive_concurrency_limited').length;
    const saturationRatio = saturationSignals / totalCandidates;

    const overloaded = averageLoad >= options.averageLoadThreshold
        || healthyRatio <= options.healthyRatioThreshold
        || saturationRatio >= options.saturationRatioThreshold;

    return {
        overloaded,
        totalCandidates,
        healthyCandidates,
        healthyRatio: Number(healthyRatio.toFixed(4)),
        averageLoad: Number(averageLoad.toFixed(4)),
        saturationRatio: Number(saturationRatio.toFixed(4))
    };
}

function scoreAgent(taskRequest, agent, options, localityOptions) {
    if (!agent || typeof agent !== 'object') {
        return {
            eligible: false,
            score: -Infinity,
            reason: 'invalid_agent'
        };
    }

    const status = typeof agent.status === 'string' ? agent.status : 'offline';
    if (!HEALTHY_STATUSES.has(status)) {
        return {
            eligible: false,
            score: -Infinity,
            reason: `status_${status}`
        };
    }

    const nowMs = Number.isFinite(options.nowMs) ? Number(options.nowMs) : Date.now();
    const maxStalenessMs = Number.isFinite(options.maxStalenessMs) ? Number(options.maxStalenessMs) : 60_000;
    const timestamp = Number(agent.timestamp ?? agent.lastHeartbeat ?? nowMs);
    const stale = Number.isFinite(timestamp) && nowMs - timestamp > maxStalenessMs;

    const load = clampLoad(agent.load, 0.5);
    const capabilities = normalizeCapabilities(agent.capabilities);
    const requiredCapabilities = extractRequiredCapabilities(taskRequest);
    const missingCapabilities = requiredCapabilities.filter((capability) => !capabilities.includes(capability));
    if (missingCapabilities.length > 0) {
        return {
            eligible: false,
            score: -Infinity,
            reason: 'missing_capabilities',
            missingCapabilities
        };
    }

    let score = computeBaseScore(taskRequest, {
        load,
        status,
        requiredCapabilities
    });
    const zone = extractAgentZone(agent);

    if (localityOptions.enabled) {
        if (localityOptions.clientZone && zone && zone !== localityOptions.clientZone) {
            if (localityOptions.strictZoneAffinity) {
                return {
                    eligible: false,
                    degradedEligible: true,
                    score: -Infinity,
                    reason: 'cross_zone_blocked',
                    missingCapabilities: [],
                    zone
                };
            }
            score = Number((score - localityOptions.crossZonePenalty).toFixed(2));
        }

        if (localityOptions.clientZone && zone && zone === localityOptions.clientZone) {
            score = Number((score + localityOptions.localZoneBoost).toFixed(2));
        }

        if (zone && localityOptions.preferredZones.includes(zone)) {
            score = Number((score + localityOptions.preferredZoneBoost).toFixed(2));
        }

        if (zone && Object.hasOwn(localityOptions.zoneWeights, zone)) {
            score = Number((score + localityOptions.zoneWeights[zone]).toFixed(2));
        }
    }

    const overload = evaluateOverloadState(agent, options);
    const overloadConfig = normalizeOverloadProtectionOptions(options);
    if (overload) {
        score = Number((score - overloadConfig.penalty).toFixed(2));
    }

    const outlier = evaluateOutlierState(agent, nowMs, options);
    const outlierConfig = normalizeOutlierOptions(options);
    if (outlier) {
        score = Number((score - outlierConfig.penalty).toFixed(2));
    }

    const slowStart = evaluateSlowStartState(agent, nowMs, options);
    if (slowStart && slowStart.weight < 1) {
        score = Number((score * slowStart.weight).toFixed(2));
    }

    const adaptive = normalizeAdaptiveConcurrencyOptions(options);
    if (adaptive.enabled) {
        const routing = extractAdaptiveRoutingStats(agent);
        if (routing.concurrencyLimit > 0) {
            const utilization = routing.inFlight / routing.concurrencyLimit;
            if (adaptive.enforce && utilization >= 1) {
                return {
                    eligible: false,
                    degradedEligible: false,
                    score: -Infinity,
                    reason: 'adaptive_concurrency_limited',
                    missingCapabilities: [],
                    ...(overload ? { overload } : {}),
                    ...(slowStart ? { slowStart } : {}),
                    ...(outlier ? { outlier } : {}),
                    ...(zone ? { zone } : {})
                };
            }

            const saturationPenalty = Math.max(0, utilization - 0.7) * adaptive.saturationPenalty;
            score = Number((score - saturationPenalty).toFixed(2));
        }

        if (
            routing.minRttMs !== null &&
            routing.sampleRttMs !== null &&
            routing.sampleRttMs > routing.minRttMs * adaptive.queueingTargetMultiplier
        ) {
            const queueingRatio = (routing.sampleRttMs / routing.minRttMs) - adaptive.queueingTargetMultiplier;
            score = Number((score - (queueingRatio * adaptive.latencyPenalty)).toFixed(2));
        }
    }

    if (overload?.enforce) {
        return {
            eligible: false,
            degradedEligible: true,
            score,
            reason: 'concurrency_saturated',
            missingCapabilities: [],
            overload,
            ...(slowStart ? { slowStart } : {}),
            ...(outlier ? { outlier } : {}),
            ...(zone ? { zone } : {})
        };
    }

    if (outlier?.state === 'ejected') {
        return {
            eligible: false,
            degradedEligible: true,
            score,
            reason: 'outlier_ejected',
            missingCapabilities: [],
            outlier,
            ...(overload ? { overload } : {}),
            ...(slowStart ? { slowStart } : {}),
            ...(zone ? { zone } : {})
        };
    }

    if (outlier?.state === 'detected' && outlier.enforce) {
        return {
            eligible: false,
            degradedEligible: true,
            score,
            reason: 'outlier_detected',
            missingCapabilities: [],
            outlier,
            ...(overload ? { overload } : {}),
            ...(slowStart ? { slowStart } : {}),
            ...(zone ? { zone } : {})
        };
    }

    if (stale) {
        const stalePenalty = Number.isFinite(options.staleHeartbeatPenalty)
            ? Number(options.staleHeartbeatPenalty)
            : DEFAULT_STALE_HEARTBEAT_PENALTY;
        return {
            eligible: false,
            degradedEligible: true,
            score: Number((score - stalePenalty).toFixed(2)),
            reason: 'stale_heartbeat',
            missingCapabilities: [],
            ...(overload ? { overload } : {}),
            ...(slowStart ? { slowStart } : {}),
            ...(outlier ? { outlier } : {}),
            ...(zone ? { zone } : {})
        };
    }

    return {
        eligible: true,
        degradedEligible: false,
        score,
        reason: 'ok',
        missingCapabilities: [],
        ...(overload ? { overload } : {}),
        ...(slowStart ? { slowStart } : {}),
        ...(outlier ? { outlier } : {}),
        ...(zone ? { zone } : {})
    };
}

function ensureTaskRequest(taskRequestPayload) {
    return TaskRequest.parse(taskRequestPayload);
}

function rankAgents(taskRequest, agents, options = {}) {
    if (!Array.isArray(agents)) {
        throw new Error('agents must be an array');
    }

    const localityOptions = normalizeLocalityOptions(taskRequest, options);
    return agents
        .map((agent) => {
            const evaluation = scoreAgent(taskRequest, agent, options, localityOptions);
            const selectionCount = safeInteger(
                agent?.routing?.selectionCount
                ?? agent?.selectionCount
                ?? agent?.outlier?.sampleSize,
                0
            );
            return {
                agentId: agent?.id || agent?.agentId || null,
                status: agent?.status,
                load: agent?.load,
                capabilities: normalizeCapabilities(agent?.capabilities),
                selectionCount,
                ...evaluation
            };
        })
        .sort((a, b) => b.score - a.score);
}

export function rankAgentsForTask(taskRequestPayload, agents, options = {}) {
    const taskRequest = ensureTaskRequest(taskRequestPayload);
    return rankAgents(taskRequest, agents, options);
}

export function selectBestAgentForTask(taskRequestPayload, agents, options = {}) {
    const taskRequest = ensureTaskRequest(taskRequestPayload);
    const localityOptions = normalizeLocalityOptions(taskRequest, options);
    const ranked = rankAgents(taskRequest, agents, options);
    let best = pickBestEligible(ranked, options);

    let localityFallbackApplied = false;
    let localityFallbackReason = null;
    let selectionRanked = ranked;

    if (
        !best
        && localityOptions.enabled
        && localityOptions.strictZoneAffinity
        && localityOptions.fallbackMode !== 'strict'
        && ranked.some((entry) => entry.reason === 'cross_zone_blocked')
    ) {
        const fallbackOptions = {
            ...options,
            locality: {
                ...(options.locality || {}),
                strictZoneAffinity: false
            }
        };
        selectionRanked = rankAgents(taskRequest, agents, fallbackOptions);
        best = pickBestEligible(selectionRanked, fallbackOptions);
        localityFallbackApplied = Boolean(best);
        localityFallbackReason = localityFallbackApplied ? 'strict_zone_affinity' : null;
    }

    return {
        selectedAgentId: best?.agentId || null,
        ranked: selectionRanked,
        localityFallbackApplied,
        localityFallbackReason
    };
}

export function routeTaskRequest(taskRequestPayload, agents, options = {}) {
    const taskRequest = ensureTaskRequest(taskRequestPayload);
    const selection = selectBestAgentForTask(taskRequest, agents, options);
    const hedgePlan = buildHedgePlan(taskRequest, selection.ranked, selection.selectedAgentId, options);
    const admissionControl = normalizeAdmissionControlOptions(taskRequest, options);

    const ranked = selection.ranked;
    const outlierActions = ranked
        .filter((item) => item.reason === 'outlier_detected' && item.outlier?.suggestedEjectedUntilMs)
        .map((item) => ({
            agentId: item.agentId,
            reason: 'outlier_detected',
            suggestedEjectedUntilMs: item.outlier.suggestedEjectedUntilMs,
            nextEjectionMs: item.outlier.nextEjectionMs
        }));

    if (admissionControl.enabled) {
        const taskPriority = normalizeString(taskRequest?.priority) || 'normal';
        const pressure = evaluateAdmissionPressure(ranked, admissionControl);
        if (pressure.overloaded && admissionControl.shedPriorities.includes(taskPriority)) {
            return {
                routed: false,
                taskRequest,
                selectedAgentId: null,
                ranked,
                localityFallbackApplied: selection.localityFallbackApplied,
                localityFallbackReason: selection.localityFallbackReason,
                ...(outlierActions.length > 0 ? { outlierActions } : {}),
                ...(hedgePlan ? { hedgePlan } : {}),
                admissionControl: {
                    enabled: true,
                    shed: true,
                    reason: 'priority_shed_under_overload',
                    taskPriority,
                    shedPriorities: admissionControl.shedPriorities,
                    pressure
                }
            };
        }
    }

    if (!selection.selectedAgentId) {
        const totalCandidates = ranked.filter((item) => typeof item.agentId === 'string' && item.agentId.trim()).length;
        const healthyCandidates = ranked.filter((item) => item.eligible && typeof item.agentId === 'string' && item.agentId.trim()).length;
        const healthyRatio = totalCandidates > 0 ? healthyCandidates / totalCandidates : 0;
        const panicModeEnabled = options.enablePanicMode === true;
        const panicThreshold = Number.isFinite(options.panicHealthyRatioThreshold)
            ? Math.max(0, Math.min(1, Number(options.panicHealthyRatioThreshold)))
            : DEFAULT_PANIC_HEALTHY_RATIO_THRESHOLD;
        const panicTriggered = panicModeEnabled && totalCandidates > 0 && healthyRatio <= panicThreshold;

        if (panicTriggered) {
            const degraded = ranked.find((item) => item.degradedEligible && typeof item.agentId === 'string' && item.agentId.trim());
            if (degraded?.agentId) {
                return {
                    routed: true,
                    degraded: true,
                    ...(outlierActions.length > 0 ? { outlierActions } : {}),
                    ...(hedgePlan ? { hedgePlan } : {}),
                    panicMode: {
                        triggered: true,
                        healthyRatio: Number(healthyRatio.toFixed(4)),
                        healthyCandidates,
                        totalCandidates,
                        threshold: panicThreshold
                    },
                    selectedAgentId: degraded.agentId,
                    ranked,
                    taskRequest: {
                        ...taskRequest,
                        target: degraded.agentId
                    }
                };
            }
        }

        return {
            routed: false,
            taskRequest,
            selectedAgentId: null,
            ranked,
            localityFallbackApplied: selection.localityFallbackApplied,
            localityFallbackReason: selection.localityFallbackReason,
            ...(outlierActions.length > 0 ? { outlierActions } : {}),
            ...(hedgePlan ? { hedgePlan } : {}),
            panicMode: {
                triggered: panicTriggered,
                healthyRatio: Number(healthyRatio.toFixed(4)),
                healthyCandidates,
                totalCandidates,
                threshold: panicThreshold
            }
        };
    }

    return {
        routed: true,
        selectedAgentId: selection.selectedAgentId,
        ranked,
        localityFallbackApplied: selection.localityFallbackApplied,
        localityFallbackReason: selection.localityFallbackReason,
        ...(outlierActions.length > 0 ? { outlierActions } : {}),
        ...(hedgePlan ? { hedgePlan } : {}),
        taskRequest: {
            ...taskRequest,
            target: selection.selectedAgentId
        }
    };
}
