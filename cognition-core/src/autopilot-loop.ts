function round(value, decimals = 4) {
    if (!Number.isFinite(value)) return value;
    return Number(value.toFixed(decimals));
}

function clampInteger(value, min, max) {
    const numeric = Math.round(Number(value));
    if (!Number.isFinite(numeric)) return min;
    return Math.max(min, Math.min(max, numeric));
}

function percentile(values, ratio = 0.5) {
    const list = (Array.isArray(values) ? values : [])
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value))
        .sort((a, b) => a - b);
    if (list.length === 0) return null;

    const index = Math.min(
        list.length - 1,
        Math.max(0, Math.floor((list.length - 1) * ratio))
    );
    return list[index];
}

function computeAdaptiveThreshold(minimum, baselineDeltas, { factor = 0.5 } = {}) {
    const minValue = Number.isFinite(Number(minimum)) ? Number(minimum) : 0;
    const positiveDeltas = (Array.isArray(baselineDeltas) ? baselineDeltas : [])
        .map((delta) => Number(delta))
        .filter((delta) => Number.isFinite(delta) && delta > 0);

    if (positiveDeltas.length === 0) {
        return {
            value: minValue,
            applied: false,
            baselineMedian: null
        };
    }

    const baselineMedian = percentile(positiveDeltas, 0.5);
    if (!Number.isFinite(Number(baselineMedian))) {
        return {
            value: minValue,
            applied: false,
            baselineMedian: null
        };
    }

    const scaled = Number(baselineMedian) * Math.max(0, Number(factor) || 0.5);
    const value = Math.max(minValue, round(scaled, 6));
    return {
        value,
        applied: value > minValue,
        baselineMedian: round(Number(baselineMedian), 6)
    };
}

function normalizeStatus(status) {
    if (typeof status !== 'string') return 'unknown';
    const normalized = status.trim().toLowerCase();
    if (normalized === 'pass' || normalized === 'warn' || normalized === 'fail') {
        return normalized;
    }
    return 'unknown';
}

function normalizeStagnationCause(cause) {
    const normalized = typeof cause === 'string' ? cause.trim().toLowerCase() : '';
    if (normalized === 'both') return 'both';
    if (normalized === 'readiness_only') return 'readiness_only';
    if (normalized === 'outcomes_only') return 'outcomes_only';
    return 'none';
}

function normalizeFocusLabel(focus) {
    if (typeof focus !== 'string') return 'unknown_focus';
    const normalized = focus.trim().toLowerCase();
    return normalized || 'unknown_focus';
}

function safeFiniteNumber(value, fallback = 0) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
}

function roundInteger(value) {
    return Math.round(safeFiniteNumber(value, 0));
}

export function buildAutopilotCycleSnapshot({
    cycle,
    buildExitCode,
    startedAt,
    finishedAt,
    readiness = null,
    learning = null,
    analysis = null
}) {
    const readinessStatus = normalizeStatus(readiness?.status);
    const readinessScore = Number(readiness?.readinessScore);
    const outcomeTotal = Number(learning?.summary?.total) || 0;
    const successRate = Number(learning?.summary?.successRate) || 0;
    const failureRate = Number(learning?.summary?.failureRate) || 0;
    const learningDrift = learning?.state?.driftLevel
        || learning?.errorTaxonomy?.driftLevel
        || 'unknown';
    const reliabilityScore = Number(analysis?.reliabilityScore);

    return {
        cycle,
        buildExitCode: Number(buildExitCode),
        startedAt,
        finishedAt,
        durationMs: Math.max(0, Number(finishedAt) - Number(startedAt)),
        readinessStatus,
        readinessScore: Number.isFinite(readinessScore) ? readinessScore : null,
        outcomeTotal,
        successRate: round(successRate, 4),
        failureRate: round(failureRate, 4),
        learningDrift,
        reliabilityScore: Number.isFinite(reliabilityScore) ? reliabilityScore : null
    };
}

export function shouldStopAutopilot(
    cycles,
    {
        targetStatus = 'pass',
        plateauPatience = 2,
        minReadinessGain = 0.005,
        minOutcomeGain = 1,
        adaptiveThresholds = true,
        adaptiveThresholdFactor = 0.5
    } = {}
) {
    const list = Array.isArray(cycles) ? cycles : [];
    if (list.length === 0) {
        return {
            stop: false,
            reason: 'no_cycles'
        };
    }

    const last = list[list.length - 1];
    const normalizedTarget = normalizeStatus(targetStatus);
    if (normalizedTarget !== 'unknown' && last.readinessStatus === normalizedTarget) {
        return {
            stop: true,
            reason: `target_status_reached:${normalizedTarget}`
        };
    }

    const patience = Math.max(1, Number(plateauPatience) || 2);
    if (list.length < patience + 1) {
        return {
            stop: false,
            reason: 'insufficient_history'
        };
    }

    const fullReadinessDeltas = [];
    const fullOutcomeDeltas = [];
    for (let i = 1; i < list.length; i++) {
        const previous = Number(list[i - 1]?.readinessScore);
        const current = Number(list[i]?.readinessScore);
        if (!Number.isFinite(previous) || !Number.isFinite(current)) {
            return {
                stop: false,
                reason: 'missing_readiness_scores'
            };
        }
        fullReadinessDeltas.push(round(current - previous, 6));

        const previousOutcomes = Number(list[i - 1]?.outcomeTotal || 0);
        const currentOutcomes = Number(list[i]?.outcomeTotal || 0);
        fullOutcomeDeltas.push(currentOutcomes - previousOutcomes);
    }

    const minReadiness = Number.isFinite(Number(minReadinessGain))
        ? Number(minReadinessGain)
        : 0.005;
    const minOutcomes = Number.isFinite(Number(minOutcomeGain))
        ? Number(minOutcomeGain)
        : 1;

    const recentDeltaStart = Math.max(0, fullReadinessDeltas.length - patience);
    const readinessDeltas = fullReadinessDeltas.slice(recentDeltaStart);
    const outcomeDeltas = fullOutcomeDeltas.slice(recentDeltaStart);
    const baselineReadinessDeltas = fullReadinessDeltas.slice(0, recentDeltaStart);
    const baselineOutcomeDeltas = fullOutcomeDeltas.slice(0, recentDeltaStart);
    const minAdaptiveHistory = Math.max(2, patience);

    const canAdapt = Boolean(adaptiveThresholds)
        && baselineReadinessDeltas.length >= minAdaptiveHistory
        && baselineOutcomeDeltas.length >= minAdaptiveHistory;

    const readinessThreshold = canAdapt
        ? computeAdaptiveThreshold(minReadiness, baselineReadinessDeltas, {
            factor: adaptiveThresholdFactor
        })
        : {
            value: minReadiness,
            applied: false,
            baselineMedian: null
        };
    const outcomeThreshold = canAdapt
        ? computeAdaptiveThreshold(minOutcomes, baselineOutcomeDeltas, {
            factor: adaptiveThresholdFactor
        })
        : {
            value: minOutcomes,
            applied: false,
            baselineMedian: null
        };

    const readinessPlateau = readinessDeltas.every((delta) => delta < readinessThreshold.value);
    const outcomePlateau = outcomeDeltas.every((delta) => delta < outcomeThreshold.value);
    const readinessRegressionThreshold = -Math.max(minReadiness, readinessThreshold.value);
    const outcomeRegressionThreshold = -Math.max(minOutcomes, outcomeThreshold.value);
    const readinessRegressed = readinessDeltas.some((delta) => delta <= readinessRegressionThreshold);
    const outcomesRegressed = outcomeDeltas.some((delta) => delta <= outcomeRegressionThreshold);
    const stagnationCause = readinessPlateau && outcomePlateau
        ? 'both'
        : readinessPlateau
            ? 'readiness_only'
            : outcomePlateau
                ? 'outcomes_only'
                : 'none';

    const plateau = stagnationCause === 'both';
    const thresholds = {
        minReadinessGain: minReadiness,
        minOutcomeGain: minOutcomes,
        effectiveReadinessGain: readinessThreshold.value,
        effectiveOutcomeGain: outcomeThreshold.value,
        adaptiveApplied: readinessThreshold.applied || outcomeThreshold.applied,
        adaptiveFactor: Number(adaptiveThresholdFactor),
        adaptiveHistory: {
            required: minAdaptiveHistory,
            observed: Math.min(baselineReadinessDeltas.length, baselineOutcomeDeltas.length)
        },
        baselineMedians: {
            readiness: readinessThreshold.baselineMedian,
            outcomes: outcomeThreshold.baselineMedian
        }
    };

    if (readinessRegressed || outcomesRegressed) {
        const regressionCause = readinessRegressed && outcomesRegressed
            ? 'both'
            : readinessRegressed
                ? 'readiness_only'
                : 'outcomes_only';
        return {
            stop: false,
            reason: `regression_detected:${regressionCause}`,
            readinessDeltas,
            outcomeDeltas,
            stagnationCause: regressionCause,
            regression: {
                readinessRegressed,
                outcomesRegressed,
                readinessRegressionThreshold,
                outcomeRegressionThreshold
            },
            thresholds
        };
    }

    return plateau
        ? {
            stop: true,
            reason: `plateau:${patience}_cycles:${stagnationCause}`,
            stagnationCause,
            readinessDeltas,
            outcomeDeltas,
            thresholds
        }
        : {
            stop: false,
            reason: 'continue',
            readinessDeltas,
            outcomeDeltas,
            stagnationCause,
            thresholds
        };
}

function createEmptyProfileStats() {
    return {
        observations: 0,
        successfulObservations: 0,
        totalReadinessGain: 0,
        totalOutcomeGain: 0,
        totalScore: 0,
        totalRemediationMax: 0,
        totalSkillGrowthMax: 0,
        totalIterationMax: 0,
        totalDispatchLimit: 0,
        avgReadinessGain: 0,
        avgOutcomeGain: 0,
        avgScore: 0,
        avgRemediationMax: 0,
        avgSkillGrowthMax: 0,
        avgIterationMax: 0,
        avgDispatchLimit: 0,
        contexts: {}
    };
}

function normalizeProfileStats(seed) {
    const base = createEmptyProfileStats();
    if (!seed || typeof seed !== 'object') return base;

    const observations = Math.max(0, roundInteger(seed.observations));
    const successfulObservations = Math.max(0, Math.min(observations, roundInteger(seed.successfulObservations)));
    const deriveTotal = (totalValue, avgValue) => {
        const total = Number(totalValue);
        if (Number.isFinite(total)) return total;
        const avg = Number(avgValue);
        if (Number.isFinite(avg) && observations > 0) {
            return avg * observations;
        }
        return 0;
    };

    const stats = {
        ...base,
        observations,
        successfulObservations,
        totalReadinessGain: deriveTotal(seed.totalReadinessGain, seed.avgReadinessGain),
        totalOutcomeGain: deriveTotal(seed.totalOutcomeGain, seed.avgOutcomeGain),
        totalScore: deriveTotal(seed.totalScore, seed.avgScore),
        totalRemediationMax: deriveTotal(seed.totalRemediationMax, seed.avgRemediationMax),
        totalSkillGrowthMax: deriveTotal(seed.totalSkillGrowthMax, seed.avgSkillGrowthMax),
        totalIterationMax: deriveTotal(seed.totalIterationMax, seed.avgIterationMax),
        totalDispatchLimit: deriveTotal(seed.totalDispatchLimit, seed.avgDispatchLimit),
        contexts: {}
    };

    const contextEntries = Object.entries(seed.contexts || {});
    for (const [contextKey, contextStats] of contextEntries) {
        if (!contextKey || typeof contextStats !== 'object') continue;
        const contextObservations = Math.max(0, roundInteger(contextStats.observations));
        const contextTotalScore = Number.isFinite(Number(contextStats.totalScore))
            ? Number(contextStats.totalScore)
            : (Number.isFinite(Number(contextStats.avgScore))
                ? Number(contextStats.avgScore) * contextObservations
                : 0);
        const contextTotalReadinessGain = Number.isFinite(Number(contextStats.totalReadinessGain))
            ? Number(contextStats.totalReadinessGain)
            : (Number.isFinite(Number(contextStats.avgReadinessGain))
                ? Number(contextStats.avgReadinessGain) * contextObservations
                : 0);
        const contextTotalOutcomeGain = Number.isFinite(Number(contextStats.totalOutcomeGain))
            ? Number(contextStats.totalOutcomeGain)
            : (Number.isFinite(Number(contextStats.avgOutcomeGain))
                ? Number(contextStats.avgOutcomeGain) * contextObservations
                : 0);
        stats.contexts[contextKey] = {
            observations: contextObservations,
            totalScore: contextTotalScore,
            avgScore: contextObservations > 0
                ? safeFiniteNumber(contextTotalScore / contextObservations, 0)
                : safeFiniteNumber(contextStats.avgScore, 0),
            totalReadinessGain: contextTotalReadinessGain,
            totalOutcomeGain: contextTotalOutcomeGain,
            avgReadinessGain: contextObservations > 0
                ? safeFiniteNumber(contextTotalReadinessGain / contextObservations, 0)
                : safeFiniteNumber(contextStats.avgReadinessGain, 0),
            avgOutcomeGain: contextObservations > 0
                ? safeFiniteNumber(contextTotalOutcomeGain / contextObservations, 0)
                : safeFiniteNumber(contextStats.avgOutcomeGain, 0)
        };
    }

    if (stats.observations > 0) {
        stats.avgReadinessGain = round(stats.totalReadinessGain / stats.observations, 6);
        stats.avgOutcomeGain = round(stats.totalOutcomeGain / stats.observations, 6);
        stats.avgScore = round(stats.totalScore / stats.observations, 6);
        stats.avgRemediationMax = round(stats.totalRemediationMax / stats.observations, 6);
        stats.avgSkillGrowthMax = round(stats.totalSkillGrowthMax / stats.observations, 6);
        stats.avgIterationMax = round(stats.totalIterationMax / stats.observations, 6);
        stats.avgDispatchLimit = round(stats.totalDispatchLimit / stats.observations, 6);
    }

    return stats;
}

function buildProfileContextKey(readinessStatus, stagnationCause) {
    return `${normalizeStatus(readinessStatus)}|${normalizeStagnationCause(stagnationCause)}`;
}

export function createAutopilotProfileMemory(seed = null) {
    const base = {
        version: 1,
        generatedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalObservations: 0,
        profiles: {},
        lastObservation: null
    };
    if (!seed || typeof seed !== 'object') {
        return base;
    }

    const profileEntries = Object.entries(seed.profiles || {});
    const profiles = {};
    for (const [focus, stats] of profileEntries) {
        const normalizedFocus = normalizeFocusLabel(focus);
        profiles[normalizedFocus] = normalizeProfileStats(stats);
    }

    const totalObservations = Math.max(
        0,
        roundInteger(seed.totalObservations)
    ) || Object.values(profiles).reduce(
        (acc, stats) => acc + Math.max(0, roundInteger(stats.observations)),
        0
    );

    return {
        version: 1,
        generatedAt: typeof seed.generatedAt === 'string' ? seed.generatedAt : base.generatedAt,
        updatedAt: typeof seed.updatedAt === 'string' ? seed.updatedAt : base.updatedAt,
        totalObservations,
        profiles,
        lastObservation: seed.lastObservation && typeof seed.lastObservation === 'object'
            ? seed.lastObservation
            : null
    };
}

function ensureProfileStats(memory, focus) {
    const key = normalizeFocusLabel(focus);
    if (!memory.profiles[key]) {
        memory.profiles[key] = createEmptyProfileStats();
    }
    return memory.profiles[key];
}

export function recordAutopilotProfileObservation(
    profileMemory,
    {
        executionProfile = null,
        previousCycle = null,
        currentCycle = null,
        stopDecision = null
    } = {}
) {
    const memory = createAutopilotProfileMemory(profileMemory);
    const focus = normalizeFocusLabel(executionProfile?.focus || 'unknown_focus');
    const stats = ensureProfileStats(memory, focus);

    const previousReadiness = Number(previousCycle?.readinessScore);
    const currentReadiness = Number(currentCycle?.readinessScore);
    const hasReadinessDelta = Number.isFinite(previousReadiness) && Number.isFinite(currentReadiness);
    const readinessDelta = hasReadinessDelta
        ? round(currentReadiness - previousReadiness, 6)
        : 0;

    const previousOutcomes = safeFiniteNumber(previousCycle?.outcomeTotal, 0);
    const currentOutcomes = safeFiniteNumber(currentCycle?.outcomeTotal, 0);
    const outcomeDelta = round(currentOutcomes - previousOutcomes, 6);

    const readinessComponent = readinessDelta * 100;
    const outcomeComponent = Math.sign(outcomeDelta) * Math.log1p(Math.abs(outcomeDelta)) * 8;
    const score = round(readinessComponent + outcomeComponent, 6);

    const contextKey = buildProfileContextKey(
        executionProfile?.readinessStatus || currentCycle?.readinessStatus,
        executionProfile?.stagnationCause || stopDecision?.stagnationCause
    );
    if (!stats.contexts[contextKey]) {
        stats.contexts[contextKey] = {
            observations: 0,
            totalScore: 0,
            avgScore: 0,
            totalReadinessGain: 0,
            totalOutcomeGain: 0,
            avgReadinessGain: 0,
            avgOutcomeGain: 0
        };
    }
    const contextStats = stats.contexts[contextKey];

    const remediationMax = roundInteger(executionProfile?.maxRemediationTasks);
    const skillGrowthMax = roundInteger(executionProfile?.maxSkillGrowthTasks);
    const iterationMax = roundInteger(executionProfile?.maxIterationTasks);
    const dispatchLimit = roundInteger(executionProfile?.dispatchLimit);

    stats.observations += 1;
    stats.successfulObservations += score > 0 ? 1 : 0;
    stats.totalReadinessGain += readinessDelta;
    stats.totalOutcomeGain += outcomeDelta;
    stats.totalScore += score;
    stats.totalRemediationMax += remediationMax;
    stats.totalSkillGrowthMax += skillGrowthMax;
    stats.totalIterationMax += iterationMax;
    stats.totalDispatchLimit += dispatchLimit;
    stats.avgReadinessGain = round(stats.totalReadinessGain / stats.observations, 6);
    stats.avgOutcomeGain = round(stats.totalOutcomeGain / stats.observations, 6);
    stats.avgScore = round(stats.totalScore / stats.observations, 6);
    stats.avgRemediationMax = round(stats.totalRemediationMax / stats.observations, 6);
    stats.avgSkillGrowthMax = round(stats.totalSkillGrowthMax / stats.observations, 6);
    stats.avgIterationMax = round(stats.totalIterationMax / stats.observations, 6);
    stats.avgDispatchLimit = round(stats.totalDispatchLimit / stats.observations, 6);

    contextStats.observations += 1;
    contextStats.totalScore += score;
    contextStats.totalReadinessGain += readinessDelta;
    contextStats.totalOutcomeGain += outcomeDelta;
    contextStats.avgScore = round(contextStats.totalScore / contextStats.observations, 6);
    contextStats.avgReadinessGain = round(contextStats.totalReadinessGain / contextStats.observations, 6);
    contextStats.avgOutcomeGain = round(contextStats.totalOutcomeGain / contextStats.observations, 6);

    memory.totalObservations += 1;
    memory.updatedAt = new Date().toISOString();
    memory.lastObservation = {
        at: memory.updatedAt,
        focus,
        context: contextKey,
        readinessDelta,
        outcomeDelta,
        score
    };

    return memory;
}

export function recommendAutopilotProfileFromMemory(
    profileMemory,
    {
        readinessStatus = 'warn',
        stagnationCause = 'none',
        minObservations = 2
    } = {}
) {
    const memory = createAutopilotProfileMemory(profileMemory);
    const contextKey = buildProfileContextKey(readinessStatus, stagnationCause);
    const candidates = [];

    for (const [focus, rawStats] of Object.entries(memory.profiles || {})) {
        const stats = normalizeProfileStats(rawStats);
        if (stats.observations < Math.max(1, Number(minObservations) || 2)) {
            continue;
        }

        const contextStats = stats.contexts?.[contextKey] || null;
        const contextObservations = Math.max(0, roundInteger(contextStats?.observations || 0));
        const contextAvgScore = safeFiniteNumber(contextStats?.avgScore, stats.avgScore);
        const contextWeight = contextObservations > 0
            ? Math.min(0.6, contextObservations / Math.max(1, stats.observations))
            : 0;
        const weightedScore = round(
            (safeFiniteNumber(stats.avgScore, 0) * (1 - contextWeight))
                + (contextAvgScore * contextWeight),
            6
        );
        const confidence = round(
            Math.min(1, stats.observations / Math.max(1, Number(minObservations) || 2)),
            4
        );

        candidates.push({
            focus,
            weightedScore,
            confidence,
            observations: stats.observations,
            contextObservations,
            averages: {
                remediationMax: stats.avgRemediationMax || 0,
                skillGrowthMax: stats.avgSkillGrowthMax || 0,
                iterationMax: stats.avgIterationMax || 0,
                dispatchLimit: stats.avgDispatchLimit || 0
            },
            metrics: {
                avgScore: stats.avgScore,
                avgReadinessGain: stats.avgReadinessGain,
                avgOutcomeGain: stats.avgOutcomeGain
            }
        });
    }

    if (candidates.length === 0) {
        return null;
    }

    candidates.sort((a, b) => {
        if (a.weightedScore !== b.weightedScore) {
            return b.weightedScore - a.weightedScore;
        }
        if (a.confidence !== b.confidence) {
            return b.confidence - a.confidence;
        }
        return b.observations - a.observations;
    });

    const best = candidates[0];
    return {
        contextKey,
        selected: best,
        candidates
    };
}

export function detectPersistentStagnation(
    cycles,
    {
        window = 2,
        requireSameCause = true
    } = {}
) {
    const list = Array.isArray(cycles) ? cycles : [];
    const lookback = Math.max(1, roundInteger(window) || 2);
    if (list.length < lookback) {
        return {
            persisted: false,
            window: lookback,
            cause: 'none',
            causes: []
        };
    }

    const recent = list.slice(-lookback);
    const causes = recent.map((cycle) => normalizeStagnationCause(
        cycle?.stagnationCause
            || cycle?.executionProfile?.stagnationCause
            || 'none'
    ));
    const allNonNone = causes.every((cause) => cause !== 'none');
    const sameCause = new Set(causes).size === 1;
    const persisted = allNonNone && (!requireSameCause || sameCause);

    return {
        persisted,
        window: lookback,
        cause: persisted
            ? (sameCause ? causes[0] : 'mixed')
            : 'none',
        causes
    };
}

const FOCUS_PLAYBOOK = {
    reliability_recovery: {
        primary: 'Run reliability recovery sprint: patch top failure signatures and tighten timeout/transport policy.',
        secondary: 'Publish reliability delta report comparing prior and current cycle outcomes.'
    },
    balanced_stabilization: {
        primary: 'Run stabilization sprint: reduce readiness drift while preserving current throughput.',
        secondary: 'Instrument guardrail checks for remediation, learning, and iteration pipelines.'
    },
    frontier_exploration: {
        primary: 'Run frontier exploration sprint: schedule novel tool/skill experiments with strict rollback checks.',
        secondary: 'Publish exploration impact report with readiness and outcome attribution.'
    },
    systemic_recovery_sprint: {
        primary: 'Run systemic recovery sprint: execute cross-functional remediation and skill upgrades in parallel.',
        secondary: 'Create incident-style postmortem with root causes and locked follow-up tasks.'
    },
    static: {
        primary: 'Run static cognition maintenance sprint with explicit measurable checkpoints.',
        secondary: 'Capture telemetry for next adaptive profile selection.'
    }
};

function targetForFocusPriority(focus, priority) {
    if (priority === 'critical') return 'agent:cognition:critical';
    if (focus === 'frontier_exploration') return 'agent:cognition:explore';
    return 'agent:cognition:ops';
}

export function buildAutopilotFocusBundleSpecs(
    {
        executionProfile = null,
        stopDecision = null,
        persistence = null,
        cycle = null
    } = {},
    {
        maxItems = 2
    } = {}
) {
    const focus = normalizeFocusLabel(executionProfile?.focus || 'balanced_stabilization');
    const stagnationCause = normalizeStagnationCause(
        stopDecision?.stagnationCause
            || persistence?.cause
            || executionProfile?.stagnationCause
            || 'none'
    );
    if (stagnationCause === 'none') {
        return [];
    }
    if (persistence && persistence.persisted === false) {
        return [];
    }

    const playbook = FOCUS_PLAYBOOK[focus] || FOCUS_PLAYBOOK.balanced_stabilization;
    const primaryPriority = stagnationCause === 'both' ? 'critical' : 'high';
    const secondaryPriority = primaryPriority === 'critical' ? 'high' : 'normal';
    const contextText = `Stagnation cause: ${stagnationCause}. Focus profile: ${focus}.`;
    const generatedCycle = Number.isFinite(Number(cycle)) ? Number(cycle) : null;

    const tasks = [
        {
            key: `autopilot-focus:${focus}:${stagnationCause}:primary`,
            title: `Autopilot focus sprint (${focus})`,
            task: `${playbook.primary} ${contextText}`,
            priority: primaryPriority,
            target: targetForFocusPriority(focus, primaryPriority),
            context: {
                focus,
                stagnationCause,
                role: 'primary',
                cycle: generatedCycle
            }
        },
        {
            key: `autopilot-focus:${focus}:${stagnationCause}:secondary`,
            title: `Autopilot focus telemetry (${focus})`,
            task: `${playbook.secondary} ${contextText}`,
            priority: secondaryPriority,
            target: targetForFocusPriority(focus, secondaryPriority),
            context: {
                focus,
                stagnationCause,
                role: 'secondary',
                cycle: generatedCycle
            }
        }
    ];

    return tasks.slice(0, Math.max(1, roundInteger(maxItems) || 2));
}

export function deriveAutopilotExecutionProfile(
    cycles,
    stopDecision = null,
    {
        minTasks = 1,
        maxTasks = 12,
        minDispatchLimit = 10,
        maxDispatchLimit = 200,
        profileMemory = null,
        profileMemoryWeight = 0.35,
        minProfileObservations = 2
    } = {}
) {
    const list = Array.isArray(cycles) ? cycles : [];
    const last = list[list.length - 1] || null;
    const readinessStatus = normalizeStatus(last?.readinessStatus || 'warn');
    const stagnationCause = normalizeStagnationCause(stopDecision?.stagnationCause);
    const adaptiveApplied = Boolean(stopDecision?.thresholds?.adaptiveApplied);

    const profile = readinessStatus === 'fail'
        ? {
            remediationMax: 6,
            skillGrowthMax: 3,
            iterationMax: 4,
            dispatchLimit: 60,
            focus: 'reliability_recovery'
        }
        : readinessStatus === 'pass'
            ? {
                remediationMax: 3,
                skillGrowthMax: 5,
                iterationMax: 5,
                dispatchLimit: 45,
                focus: 'frontier_exploration'
            }
            : {
                remediationMax: 4,
                skillGrowthMax: 4,
                iterationMax: 4,
                dispatchLimit: 50,
                focus: 'balanced_stabilization'
            };

    const rationale = [`base:${readinessStatus}`];

    if (stagnationCause === 'readiness_only') {
        profile.remediationMax += 2;
        profile.iterationMax += 1;
        profile.skillGrowthMax -= 1;
        rationale.push('boost_remediation_for_readiness_plateau');
    } else if (stagnationCause === 'outcomes_only') {
        profile.skillGrowthMax += 2;
        profile.iterationMax += 1;
        profile.remediationMax -= 1;
        rationale.push('boost_skill_growth_for_outcome_plateau');
    } else if (stagnationCause === 'both') {
        profile.remediationMax += 2;
        profile.skillGrowthMax += 2;
        profile.iterationMax += 2;
        profile.dispatchLimit += 15;
        profile.focus = 'systemic_recovery_sprint';
        rationale.push('systemic_stagnation_recovery');
    }

    if (adaptiveApplied && stagnationCause !== 'none') {
        profile.iterationMax += 1;
        rationale.push('adaptive_thresholds_confirmed_plateau_signal');
    }

    const memoryRecommendation = recommendAutopilotProfileFromMemory(profileMemory, {
        readinessStatus,
        stagnationCause,
        minObservations: minProfileObservations
    });
    if (memoryRecommendation?.selected) {
        const recommended = memoryRecommendation.selected;
        const weight = Math.max(0, Math.min(1, safeFiniteNumber(profileMemoryWeight, 0.35)));
        const averages = recommended.averages || {};
        profile.remediationMax = ((profile.remediationMax * (1 - weight))
            + (safeFiniteNumber(averages.remediationMax, profile.remediationMax) * weight));
        profile.skillGrowthMax = ((profile.skillGrowthMax * (1 - weight))
            + (safeFiniteNumber(averages.skillGrowthMax, profile.skillGrowthMax) * weight));
        profile.iterationMax = ((profile.iterationMax * (1 - weight))
            + (safeFiniteNumber(averages.iterationMax, profile.iterationMax) * weight));
        profile.dispatchLimit = ((profile.dispatchLimit * (1 - weight))
            + (safeFiniteNumber(averages.dispatchLimit, profile.dispatchLimit) * weight));
        if (recommended.focus && recommended.focus !== profile.focus) {
            rationale.push(`memory_recommended_focus:${recommended.focus}`);
            profile.focus = recommended.focus;
        } else {
            rationale.push('memory_reinforced_profile');
        }
        rationale.push(`memory_weight:${round(weight, 3)}`);
    }

    const bounded = {
        remediationMax: clampInteger(profile.remediationMax, minTasks, maxTasks),
        skillGrowthMax: clampInteger(profile.skillGrowthMax, minTasks, maxTasks),
        iterationMax: clampInteger(profile.iterationMax, minTasks, maxTasks),
        dispatchLimit: clampInteger(profile.dispatchLimit, minDispatchLimit, maxDispatchLimit)
    };

    return {
        ...bounded,
        focus: profile.focus,
        readinessStatus,
        stagnationCause,
        adaptiveApplied,
        rationale,
        memoryRecommendation: memoryRecommendation?.selected || null
    };
}

export function buildAutopilotSummary(cycles, stopDecision) {
    const list = Array.isArray(cycles) ? cycles : [];
    const first = list[0] || null;
    const last = list[list.length - 1] || null;

    const readinessGain = first && last
        && Number.isFinite(Number(first.readinessScore))
        && Number.isFinite(Number(last.readinessScore))
        ? round(Number(last.readinessScore) - Number(first.readinessScore), 4)
        : null;

    const outcomeGain = first && last
        ? Number(last.outcomeTotal || 0) - Number(first.outcomeTotal || 0)
        : null;

    return {
        cycles: list.length,
        finalReadinessStatus: last?.readinessStatus || 'unknown',
        finalReadinessScore: Number.isFinite(Number(last?.readinessScore))
            ? Number(last.readinessScore)
            : null,
        readinessGain,
        outcomeGain,
        stagnationCause: stopDecision?.stagnationCause || 'none',
        stopReason: stopDecision?.reason || 'completed'
    };
}

export function renderAutopilotMarkdown(report) {
    const lines = [];
    lines.push('# Cognition Autopilot Report');
    lines.push('');
    lines.push(`Generated: ${report.generatedAt}`);
    lines.push(`Stop reason: ${report.summary.stopReason}`);
    lines.push(`Final readiness: ${report.summary.finalReadinessStatus} (${report.summary.finalReadinessScore ?? 'n/a'})`);
    lines.push(`Readiness gain: ${report.summary.readinessGain ?? 'n/a'}`);
    lines.push(`Outcome gain: ${report.summary.outcomeGain ?? 'n/a'}`);
    if (Array.isArray(report.focusBundles) && report.focusBundles.length > 0) {
        const generated = report.focusBundles.reduce((acc, item) => acc + (Number(item?.generated) || 0), 0);
        const saved = report.focusBundles.reduce((acc, item) => acc + (Number(item?.saved) || 0), 0);
        lines.push(`Focus bundles: ${saved}/${generated} enqueued`);
    }
    if (report.profileMemory?.totalObservations !== undefined) {
        lines.push(`Profile memory observations: ${report.profileMemory.totalObservations}`);
    }
    if (report.summary?.stagnationCause && report.summary.stagnationCause !== 'none') {
        lines.push(`Stagnation cause: ${report.summary.stagnationCause}`);
    }
    if (report.stopDecision?.thresholds) {
        lines.push(`Effective thresholds: readiness<${report.stopDecision.thresholds.effectiveReadinessGain}, outcomes<${report.stopDecision.thresholds.effectiveOutcomeGain}`);
    }
    lines.push('');
    lines.push('| Cycle | Exit | Readiness | Score | Outcomes | Success | Failure | Drift | Reliability | Focus | Duration(ms) |');
    lines.push('| --- | ---: | --- | ---: | ---: | ---: | ---: | --- | ---: | --- | ---: |');

    for (const cycle of report.cycles || []) {
        lines.push(`| ${cycle.cycle} | ${cycle.buildExitCode} | ${cycle.readinessStatus} | ${cycle.readinessScore ?? 'n/a'} | ${cycle.outcomeTotal} | ${(Number(cycle.successRate || 0) * 100).toFixed(2)}% | ${(Number(cycle.failureRate || 0) * 100).toFixed(2)}% | ${cycle.learningDrift} | ${cycle.reliabilityScore ?? 'n/a'} | ${cycle.executionProfile?.focus || 'n/a'} | ${cycle.durationMs} |`);
    }
    if ((report.cycles || []).length === 0) {
        lines.push('| (none) | - | - | - | - | - | - | - | - | - | - |');
    }
    lines.push('');
    return `${lines.join('\n')}\n`;
}
