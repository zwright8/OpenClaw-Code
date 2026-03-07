function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function mean(values) {
    if (!Array.isArray(values) || values.length === 0) return 0;
    return values.reduce((acc, value) => acc + value, 0) / values.length;
}

function quantileSorted(sortedValues, percentile) {
    if (!Array.isArray(sortedValues) || sortedValues.length === 0) return null;
    const p = clamp(Number(percentile) || 0, 0, 1);
    const index = (sortedValues.length - 1) * p;
    const lowerIndex = Math.floor(index);
    const upperIndex = Math.ceil(index);
    const lower = sortedValues[lowerIndex];
    const upper = sortedValues[upperIndex];
    if (!Number.isFinite(lower) || !Number.isFinite(upper)) return null;
    if (lowerIndex === upperIndex) return lower;
    return lower + (upper - lower) * (index - lowerIndex);
}

function latencyPercentiles(values) {
    if (!Array.isArray(values) || values.length === 0) {
        return { p50: 0, p95: 0, p99: 0 };
    }
    const sorted = [...values].sort((a, b) => a - b);
    return {
        p50: Number((quantileSorted(sorted, 0.5) || 0).toFixed(2)),
        p95: Number((quantileSorted(sorted, 0.95) || 0).toFixed(2)),
        p99: Number((quantileSorted(sorted, 0.99) || 0).toFixed(2))
    };
}

function wilsonLowerBound(successes, trials, z = 1.96) {
    const n = Number(trials) || 0;
    if (n <= 0) return 0;
    const s = clamp(Number(successes) || 0, 0, n);
    const phat = s / n;
    const z2 = z * z;
    const denominator = 1 + (z2 / n);
    const center = phat + (z2 / (2 * n));
    const margin = z * Math.sqrt((phat * (1 - phat) / n) + (z2 / (4 * n * n)));
    return clamp((center - margin) / denominator, 0, 1);
}

function createSeededRandom(seed = 1337) {
    let state = (Number(seed) || 1337) >>> 0;
    return () => {
        state = (1664525 * state + 1013904223) >>> 0;
        return state / 0x100000000;
    };
}

function sampleGamma(shape, random) {
    if (shape <= 0) return 0;
    if (shape < 1) {
        const u = Math.max(Number.EPSILON, random());
        return sampleGamma(shape + 1, random) * (u ** (1 / shape));
    }

    const d = shape - 1 / 3;
    const c = 1 / Math.sqrt(9 * d);
    while (true) {
        let x = 0;
        let y = 0;
        let radius = 0;
        do {
            x = random() * 2 - 1;
            y = random() * 2 - 1;
            radius = x * x + y * y;
        } while (radius === 0 || radius >= 1);
        const z = x * Math.sqrt((-2 * Math.log(radius)) / radius);
        const v = (1 + (c * z)) ** 3;
        if (v <= 0) continue;
        const u = random();
        if (u < 1 - (0.331 * (z ** 4))) return d * v;
        if (Math.log(u) < (0.5 * z * z) + (d * (1 - v + Math.log(v)))) return d * v;
    }
}

function sampleBeta(alpha, beta, random) {
    const x = sampleGamma(Math.max(alpha, Number.EPSILON), random);
    const y = sampleGamma(Math.max(beta, Number.EPSILON), random);
    const sum = x + y;
    if (sum <= 0) return 0.5;
    return x / sum;
}

function runBernoulliTrials(probability, trials, random) {
    let successes = 0;
    for (let i = 0; i < trials; i++) {
        if (random() < probability) successes++;
    }
    return successes;
}

function normalizeOutcome(outcome, index) {
    if (!outcome || typeof outcome !== 'object') {
        throw new Error(`Invalid outcome at index ${index}`);
    }

    const taskId = typeof outcome.taskId === 'string' ? outcome.taskId : `unknown-${index}`;
    const target = typeof outcome.target === 'string' ? outcome.target : 'unassigned';
    const status = typeof outcome.status === 'string' ? outcome.status : 'unknown';
    const attempts = Number.isFinite(Number(outcome.attempts)) ? Number(outcome.attempts) : 0;
    const priority = typeof outcome.request?.priority === 'string'
        ? outcome.request.priority
        : (typeof outcome.priority === 'string' ? outcome.priority : 'normal');
    const createdAt = Number.isFinite(Number(outcome.createdAt)) ? Number(outcome.createdAt) : null;
    const closedAt = Number.isFinite(Number(outcome.closedAt)) ? Number(outcome.closedAt) : null;

    return {
        taskId,
        target,
        status,
        attempts,
        priority,
        createdAt,
        closedAt,
        latencyMs: createdAt !== null && closedAt !== null
            ? Math.max(0, closedAt - createdAt)
            : null
    };
}

export function summarizeOutcomes(outcomes) {
    const normalized = outcomes.map((item, index) => normalizeOutcome(item, index));

    const totals = {
        total: normalized.length,
        success: 0,
        partial: 0,
        failure: 0,
        timedOut: 0,
        rejected: 0,
        transportError: 0,
        avgAttempts: 0,
        avgLatencyMs: 0,
        latencyPercentiles: { p50: 0, p95: 0, p99: 0 },
        successRate: 0,
        timeoutRate: 0,
        byStatus: {},
        byAgent: {},
        byPriority: {}
    };

    const latencies = [];
    const latenciesByAgent = {};
    let attemptsTotal = 0;

    for (const outcome of normalized) {
        totals.byStatus[outcome.status] = (totals.byStatus[outcome.status] || 0) + 1;
        attemptsTotal += outcome.attempts;
        if (Number.isFinite(outcome.latencyMs)) latencies.push(outcome.latencyMs);

        if (!totals.byAgent[outcome.target]) {
            totals.byAgent[outcome.target] = {
                tasks: 0,
                success: 0,
                failure: 0,
                timedOut: 0,
                avgLatencyMs: 0,
                successRate: 0,
                successRateLower95: 0,
                timeoutRate: 0,
                latencyPercentiles: { p50: 0, p95: 0, p99: 0 }
            };
            latenciesByAgent[outcome.target] = [];
        }
        if (!totals.byPriority[outcome.priority]) {
            totals.byPriority[outcome.priority] = {
                tasks: 0,
                success: 0,
                failure: 0,
                timeout: 0
            };
        }

        totals.byAgent[outcome.target].tasks++;
        totals.byPriority[outcome.priority].tasks++;
        if (Number.isFinite(outcome.latencyMs)) {
            latenciesByAgent[outcome.target].push(outcome.latencyMs);
        }

        if (outcome.status === 'completed') {
            totals.success++;
            totals.byAgent[outcome.target].success++;
            totals.byPriority[outcome.priority].success++;
        } else if (outcome.status === 'partial') {
            totals.partial++;
        } else if (outcome.status === 'timed_out') {
            totals.failure++;
            totals.timedOut++;
            totals.byAgent[outcome.target].failure++;
            totals.byAgent[outcome.target].timedOut++;
            totals.byPriority[outcome.priority].failure++;
            totals.byPriority[outcome.priority].timeout++;
        } else if (outcome.status === 'rejected') {
            totals.failure++;
            totals.rejected++;
            totals.byAgent[outcome.target].failure++;
            totals.byPriority[outcome.priority].failure++;
        } else if (outcome.status === 'transport_error') {
            totals.failure++;
            totals.transportError++;
            totals.byAgent[outcome.target].failure++;
            totals.byPriority[outcome.priority].failure++;
        } else if (outcome.status === 'failed') {
            totals.failure++;
            totals.byAgent[outcome.target].failure++;
            totals.byPriority[outcome.priority].failure++;
        }
    }

    for (const [agentId, agent] of Object.entries(totals.byAgent)) {
        const agentLatencies = latenciesByAgent[agentId] || [];
        agent.avgLatencyMs = agentLatencies.length > 0
            ? Number(mean(agentLatencies).toFixed(2))
            : 0;
        agent.successRate = agent.tasks > 0
            ? Number((agent.success / agent.tasks).toFixed(4))
            : 0;
        agent.successRateLower95 = agent.tasks > 0
            ? Number(wilsonLowerBound(agent.success, agent.tasks, 1.96).toFixed(4))
            : 0;
        agent.timeoutRate = agent.tasks > 0
            ? Number((agent.timedOut / agent.tasks).toFixed(4))
            : 0;
        agent.latencyPercentiles = latencyPercentiles(agentLatencies);
    }

    totals.avgAttempts = totals.total > 0
        ? Number((attemptsTotal / totals.total).toFixed(2))
        : 0;
    totals.avgLatencyMs = latencies.length > 0
        ? Number(mean(latencies).toFixed(2))
        : 0;
    totals.latencyPercentiles = latencyPercentiles(latencies);
    totals.successRate = totals.total > 0
        ? Number((totals.success / totals.total).toFixed(4))
        : 0;
    totals.timeoutRate = totals.total > 0
        ? Number((totals.timedOut / totals.total).toFixed(4))
        : 0;

    return {
        outcomes: normalized,
        summary: totals
    };
}

function normalizeVariant(variant, index) {
    if (!variant || typeof variant !== 'object') {
        return {
            id: `variant-${index + 1}`,
            name: `Variant ${index + 1}`,
            timeoutRecoveryRate: 0,
            retryRecoveryRate: 0,
            routingRecoveryRate: 0
        };
    }

    return {
        id: typeof variant.id === 'string' ? variant.id : `variant-${index + 1}`,
        name: typeof variant.name === 'string' ? variant.name : `Variant ${index + 1}`,
        timeoutRecoveryRate: clamp(Number(variant.timeoutRecoveryRate) || 0, 0, 1),
        retryRecoveryRate: clamp(Number(variant.retryRecoveryRate) || 0, 0, 1),
        routingRecoveryRate: clamp(Number(variant.routingRecoveryRate) || 0, 0, 1)
    };
}

export function runCounterfactualReplay(summary, variants = []) {
    const baseline = summary?.summary || summary;
    if (!baseline || typeof baseline !== 'object') {
        throw new Error('runCounterfactualReplay requires outcome summary');
    }

    const variantList = (Array.isArray(variants) && variants.length > 0
        ? variants
        : [
            {
                id: 'retry-hardening',
                name: 'Retry hardening',
                timeoutRecoveryRate: 0.35,
                retryRecoveryRate: 0.2,
                routingRecoveryRate: 0.05
            },
            {
                id: 'routing-optimizer',
                name: 'Adaptive routing + fallback',
                timeoutRecoveryRate: 0.2,
                retryRecoveryRate: 0.12,
                routingRecoveryRate: 0.35
            },
            {
                id: 'hybrid-policy',
                name: 'Hybrid safety + routing + retry',
                timeoutRecoveryRate: 0.4,
                retryRecoveryRate: 0.22,
                routingRecoveryRate: 0.28
            }
        ]).map(normalizeVariant);

    const outcomesTotal = Number(baseline.total) || 0;
    const baselineSuccess = Number(baseline.success) || 0;
    const timedOut = Number(baseline.timedOut) || 0;
    const failed = Number(baseline.failure) || 0;
    const rejected = Number(baseline.rejected) || 0;

    const runs = variantList.map((variant) => {
        const recoveredTimeout = timedOut * variant.timeoutRecoveryRate;
        const recoveredFailure = Math.max(0, failed - timedOut) * variant.retryRecoveryRate;
        const recoveredRejected = rejected * variant.routingRecoveryRate;

        const projectedSuccess = clamp(
            baselineSuccess + recoveredTimeout + recoveredFailure + recoveredRejected,
            0,
            outcomesTotal
        );
        const projectedSuccessRate = outcomesTotal > 0
            ? projectedSuccess / outcomesTotal
            : 0;

        return {
            ...variant,
            recovered: {
                timeout: Number(recoveredTimeout.toFixed(2)),
                failure: Number(recoveredFailure.toFixed(2)),
                rejected: Number(recoveredRejected.toFixed(2))
            },
            projectedSuccess: Number(projectedSuccess.toFixed(2)),
            projectedSuccessRate: Number(projectedSuccessRate.toFixed(4)),
            deltaSuccessRate: Number((projectedSuccessRate - (baseline.successRate || 0)).toFixed(4))
        };
    }).sort((a, b) => b.deltaSuccessRate - a.deltaSuccessRate);

    return {
        baselineSuccessRate: Number(baseline.successRate || 0),
        runs,
        best: runs[0] || null
    };
}

function computeRate(outcomes) {
    if (!Array.isArray(outcomes) || outcomes.length === 0) return 0;
    const successful = outcomes.filter((item) => item.status === 'completed').length;
    return successful / outcomes.length;
}

export function analyzeWindowedPerformance(
    outcomes,
    {
        recentWindowSize = 24,
        minWindowSize = 8,
        driftAlertThreshold = 0.12
    } = {}
) {
    if (!Array.isArray(outcomes)) {
        throw new Error('analyzeWindowedPerformance expects outcomes array');
    }

    const normalized = outcomes.map((item, index) => normalizeOutcome(item, index));
    const cappedWindow = Math.max(1, Math.floor(Number(recentWindowSize) || 24));
    const requiredSize = Math.max(1, Math.floor(Number(minWindowSize) || 8));

    const recent = normalized.slice(-cappedWindow);
    const baseline = normalized.slice(0, -cappedWindow);
    const recentSuccessRate = computeRate(recent);
    const baselineSuccessRate = computeRate(baseline);

    if (normalized.length < requiredSize * 2) {
        return {
            sufficientData: false,
            recentWindowSize: recent.length,
            baselineWindowSize: baseline.length,
            recentSuccessRate: Number(recentSuccessRate.toFixed(4)),
            baselineSuccessRate: Number(baselineSuccessRate.toFixed(4)),
            deltaSuccessRate: 0,
            alert: false,
            rationale: 'Insufficient history for robust drift signal'
        };
    }

    const deltaSuccessRate = Number((recentSuccessRate - baselineSuccessRate).toFixed(4));
    const alert = deltaSuccessRate <= -Math.abs(Number(driftAlertThreshold) || 0.12);

    return {
        sufficientData: true,
        recentWindowSize: recent.length,
        baselineWindowSize: baseline.length,
        recentSuccessRate: Number(recentSuccessRate.toFixed(4)),
        baselineSuccessRate: Number(baselineSuccessRate.toFixed(4)),
        deltaSuccessRate,
        alert,
        rationale: alert
            ? 'Recent success rate materially underperforms baseline window'
            : 'Recent success rate remains within accepted drift band'
    };
}

export function scoreAgentReliability(
    outcomes,
    {
        discountFactor = 0.92,
        minSamplesForAction = 6,
        lowerBoundAlertThreshold = 0.55
    } = {}
) {
    if (!Array.isArray(outcomes)) {
        throw new Error('scoreAgentReliability expects outcomes array');
    }

    const normalized = outcomes.map((item, index) => normalizeOutcome(item, index));
    const boundedDiscount = clamp(Number(discountFactor) || 0.92, 0.5, 0.999);
    const samplesFloor = Math.max(1, Math.floor(Number(minSamplesForAction) || 6));
    const lowerBoundFloor = clamp(Number(lowerBoundAlertThreshold) || 0.55, 0, 1);
    const perAgent = new Map();

    for (const outcome of normalized) {
        if (!perAgent.has(outcome.target)) {
            perAgent.set(outcome.target, {
                agentId: outcome.target,
                tasks: 0,
                successes: 0,
                discountedTasks: 0,
                discountedSuccesses: 0
            });
        }

        const current = perAgent.get(outcome.target);
        current.tasks += 1;
        if (outcome.status === 'completed') current.successes += 1;
        current.discountedTasks = (current.discountedTasks * boundedDiscount) + 1;
        current.discountedSuccesses = (current.discountedSuccesses * boundedDiscount) + (outcome.status === 'completed' ? 1 : 0);
    }

    const agents = Array.from(perAgent.values()).map((entry) => {
        const empiricalRate = entry.tasks > 0 ? entry.successes / entry.tasks : 0;
        const discountedRate = entry.discountedTasks > 0
            ? entry.discountedSuccesses / entry.discountedTasks
            : 0;
        const lowerBound = wilsonLowerBound(entry.successes, entry.tasks);
        const actionEligible = entry.tasks >= samplesFloor && lowerBound < lowerBoundFloor;
        return {
            agentId: entry.agentId,
            tasks: entry.tasks,
            empiricalSuccessRate: Number(empiricalRate.toFixed(4)),
            discountedSuccessRate: Number(discountedRate.toFixed(4)),
            successRateLowerBound: Number(lowerBound.toFixed(4)),
            actionEligible
        };
    }).sort((a, b) => a.successRateLowerBound - b.successRateLowerBound);

    return {
        discountFactor: boundedDiscount,
        minSamplesForAction: samplesFloor,
        lowerBoundAlertThreshold: lowerBoundFloor,
        agents,
        watchlist: agents.filter((agent) => agent.actionEligible).map((agent) => agent.agentId)
    };
}

export function simulateAdaptivePolicySelection(
    replay,
    {
        episodes = 48,
        trialsPerEpisode = 20,
        seed = 1337
    } = {}
) {
    if (!replay || !Array.isArray(replay.runs) || replay.runs.length === 0) {
        throw new Error('simulateAdaptivePolicySelection requires replay runs');
    }

    const totalEpisodes = Math.max(1, Math.floor(Number(episodes) || 1));
    const totalTrials = Math.max(1, Math.floor(Number(trialsPerEpisode) || 1));
    const random = createSeededRandom(seed);
    const bestProjected = Math.max(...replay.runs.map((run) => Number(run.projectedSuccessRate) || 0));

    const arms = replay.runs.map((run) => ({
        id: run.id,
        name: run.name,
        projectedSuccessRate: Number(run.projectedSuccessRate) || 0,
        alpha: 1,
        beta: 1,
        selections: 0,
        observedSuccesses: 0,
        observedFailures: 0
    }));

    let cumulativeRegret = 0;
    for (let episode = 0; episode < totalEpisodes; episode++) {
        let selected = arms[0];
        let selectedSample = -1;
        for (const arm of arms) {
            const sampled = sampleBeta(arm.alpha, arm.beta, random);
            if (sampled > selectedSample) {
                selected = arm;
                selectedSample = sampled;
            }
        }

        const successes = runBernoulliTrials(selected.projectedSuccessRate, totalTrials, random);
        const failures = totalTrials - successes;
        selected.alpha += successes;
        selected.beta += failures;
        selected.selections++;
        selected.observedSuccesses += successes;
        selected.observedFailures += failures;

        cumulativeRegret += Math.max(0, bestProjected - selected.projectedSuccessRate) * totalTrials;
    }

    const ranked = arms.map((arm) => {
        const posteriorMean = arm.alpha / (arm.alpha + arm.beta);
        return {
            id: arm.id,
            name: arm.name,
            selections: arm.selections,
            selectionRate: Number((arm.selections / totalEpisodes).toFixed(4)),
            projectedSuccessRate: Number(arm.projectedSuccessRate.toFixed(4)),
            posteriorMean: Number(posteriorMean.toFixed(4)),
            observedSuccessRate: Number((arm.observedSuccesses / Math.max(1, arm.observedSuccesses + arm.observedFailures)).toFixed(4))
        };
    }).sort((a, b) => {
        if (b.posteriorMean !== a.posteriorMean) return b.posteriorMean - a.posteriorMean;
        return b.selections - a.selections;
    });

    return {
        episodes: totalEpisodes,
        trialsPerEpisode: totalTrials,
        cumulativeRegret: Number(cumulativeRegret.toFixed(2)),
        recommendedArm: ranked[0] || null,
        ranking: ranked
    };
}

export function buildLearningRecommendations(
    summary,
    replay,
    adaptiveRollout = null,
    operationalInsightsOrThresholds = null,
    thresholdsOverride = null
) {
    let operationalInsights = null;
    let thresholdOptions = thresholdsOverride;
    if (!thresholdOptions && operationalInsightsOrThresholds && typeof operationalInsightsOrThresholds === 'object' && (
        Object.prototype.hasOwnProperty.call(operationalInsightsOrThresholds, 'minTimeoutRateForAction')
        || Object.prototype.hasOwnProperty.call(operationalInsightsOrThresholds, 'minAgentSuccessRate')
        || Object.prototype.hasOwnProperty.call(operationalInsightsOrThresholds, 'maxAvgAttempts')
        || Object.prototype.hasOwnProperty.call(operationalInsightsOrThresholds, 'minAgentSamplesForAction')
        || Object.prototype.hasOwnProperty.call(operationalInsightsOrThresholds, 'minP95LatencyMsForAction')
    )) {
        thresholdOptions = operationalInsightsOrThresholds;
    } else {
        operationalInsights = operationalInsightsOrThresholds;
    }

    const {
        minTimeoutRateForAction = 0.1,
        minAgentSuccessRate = 0.7,
        maxAvgAttempts = 1.4,
        minAgentSamplesForAction = 5,
        minP95LatencyMsForAction = 1000
    } = thresholdOptions || {};
    const baseline = summary?.summary || summary;
    if (!baseline || typeof baseline !== 'object') {
        throw new Error('buildLearningRecommendations requires outcome summary');
    }

    const recommendations = [];

    if ((baseline.timeoutRate || 0) >= minTimeoutRateForAction) {
        recommendations.push({
            priority: 'P1',
            category: 'timeout_resilience',
            title: 'Reduce timeout-driven task loss',
            rationale: `Timeout rate is ${(baseline.timeoutRate * 100).toFixed(1)}% across ${baseline.total} tasks`,
            action: 'Increase timeout budgets selectively, add fallback workers, and enforce jittered retry policies.',
            expectedImpact: {
                metric: 'timeoutRate',
                current: baseline.timeoutRate,
                target: Number(Math.max(0, baseline.timeoutRate - 0.08).toFixed(4))
            }
        });
    }

    if ((baseline.avgAttempts || 0) >= maxAvgAttempts) {
        recommendations.push({
            priority: 'P2',
            category: 'dispatch_efficiency',
            title: 'Lower retry pressure in orchestration',
            rationale: `Average attempts per task is ${baseline.avgAttempts}`,
            action: 'Prioritize stable workers and tune retry windows to avoid clustered retries.',
            expectedImpact: {
                metric: 'avgAttempts',
                current: baseline.avgAttempts,
                target: Number(Math.max(1, baseline.avgAttempts - 0.2).toFixed(2))
            }
        });
    }

    if ((baseline.latencyPercentiles?.p95 || 0) >= minP95LatencyMsForAction) {
        recommendations.push({
            priority: 'P2',
            category: 'tail_latency',
            title: 'Reduce p95 orchestration latency',
            rationale: `p95 latency is ${baseline.latencyPercentiles.p95}ms (p99: ${baseline.latencyPercentiles.p99}ms)`,
            action: 'Limit queue depth per worker, prioritize short tasks, and move long-tail tasks to isolated pools.',
            expectedImpact: {
                metric: 'latencyPercentiles.p95',
                current: baseline.latencyPercentiles.p95,
                target: Number(Math.max(0, baseline.latencyPercentiles.p95 * 0.8).toFixed(2))
            }
        });
    }

    const lowPerformers = Object.entries(baseline.byAgent || {})
        .filter(([, stats]) => {
            const tasks = Number(stats.tasks) || 0;
            const lowerBound = Number(stats.successRateLower95);
            const observed = Number(stats.successRate || 0);
            const score = Number.isFinite(lowerBound) ? lowerBound : observed;
            return tasks >= minAgentSamplesForAction && score < minAgentSuccessRate;
        })
        .sort((a, b) => {
            const aScore = Number.isFinite(Number(a[1].successRateLower95))
                ? Number(a[1].successRateLower95)
                : Number(a[1].successRate || 0);
            const bScore = Number.isFinite(Number(b[1].successRateLower95))
                ? Number(b[1].successRateLower95)
                : Number(b[1].successRate || 0);
            if (aScore !== bScore) return aScore - bScore;
            return (Number(b[1].tasks) || 0) - (Number(a[1].tasks) || 0);
        });

    for (const [agentId, stats] of lowPerformers.slice(0, 2)) {
        const lower95 = Number.isFinite(Number(stats.successRateLower95))
            ? Number(stats.successRateLower95)
            : Number(stats.successRate || 0);
        recommendations.push({
            priority: 'P2',
            category: 'routing_quality',
            title: `Improve routing quality for ${agentId}`,
            rationale: `Agent success is ${(stats.successRate * 100).toFixed(1)}% with 95% lower bound ${(lower95 * 100).toFixed(1)}% across ${stats.tasks} tasks`,
            action: 'Apply optimizer penalties for this agent until reliability recovers and add targeted health checks.',
            expectedImpact: {
                metric: `${agentId}.successRateLower95`,
                current: lower95,
                target: Number(Math.min(0.95, lower95 + 0.12).toFixed(4))
            }
        });
    }

    if (replay?.best) {
        recommendations.push({
            priority: 'P1',
            category: 'counterfactual_winner',
            title: `Adopt replay winner: ${replay.best.name}`,
            rationale: `Counterfactual replay projects +${(replay.best.deltaSuccessRate * 100).toFixed(1)}pp success rate`,
            action: 'Roll out this policy variant behind a feature flag and compare against control over next 7 days.',
            expectedImpact: {
                metric: 'successRate',
                current: replay.baselineSuccessRate,
                target: replay.best.projectedSuccessRate
            }
        });
    }

    if (operationalInsights?.drift?.sufficientData && operationalInsights.drift.alert) {
        recommendations.push({
            priority: 'P1',
            category: 'nonstationarity_guard',
            title: 'Respond to recent performance drift',
            rationale: `Recent window success rate ${(operationalInsights.drift.recentSuccessRate * 100).toFixed(1)}% is ${(Math.abs(operationalInsights.drift.deltaSuccessRate) * 100).toFixed(1)}pp below baseline`,
            action: 'Increase exploration toward healthy agents, shorten policy refresh cadence, and run replay over the latest window.',
            expectedImpact: {
                metric: 'recentSuccessRate',
                current: operationalInsights.drift.recentSuccessRate,
                target: Number(Math.min(0.98, operationalInsights.drift.recentSuccessRate + 0.1).toFixed(4))
            }
        });
    }

    if (Array.isArray(operationalInsights?.reliability?.watchlist) && operationalInsights.reliability.watchlist.length > 0) {
        const weakest = operationalInsights.reliability.agents[0];
        recommendations.push({
            priority: 'P2',
            category: 'confidence_bounded_routing',
            title: `Route guardrail for low-confidence agent(s): ${operationalInsights.reliability.watchlist.slice(0, 2).join(', ')}`,
            rationale: `${weakest.agentId} lower-bound success is ${(weakest.successRateLowerBound * 100).toFixed(1)}% over ${weakest.tasks} tasks`,
            action: 'Apply temporary routing penalties and require passing health probes before high-priority assignments.',
            expectedImpact: {
                metric: `${weakest.agentId}.successRateLowerBound`,
                current: weakest.successRateLowerBound,
                target: Number(Math.min(0.9, weakest.successRateLowerBound + 0.12).toFixed(4))
            }
        });
    }

    if (adaptiveRollout?.recommendedArm) {
        recommendations.push({
            priority: 'P1',
            category: 'adaptive_policy_selection',
            title: `Automate policy selection toward ${adaptiveRollout.recommendedArm.name}`,
            rationale: `Thompson rollout selected this policy ${(adaptiveRollout.recommendedArm.selectionRate * 100).toFixed(1)}% of episodes with posterior mean ${(adaptiveRollout.recommendedArm.posteriorMean * 100).toFixed(1)}%`,
            action: 'Deploy online Thompson sampling with a minimum exploration floor and promote policies when posterior lead remains stable for 3+ windows.',
            expectedImpact: {
                metric: 'successRate',
                current: replay?.baselineSuccessRate || 0,
                target: adaptiveRollout.recommendedArm.projectedSuccessRate
            }
        });
    }

    return recommendations;
}

export function evaluateLearningLoop(outcomes, options = {}) {
    if (!Array.isArray(outcomes)) {
        throw new Error('evaluateLearningLoop expects outcomes array');
    }

    const summarized = summarizeOutcomes(outcomes);
    const replay = runCounterfactualReplay(summarized, options.variants);
    const adaptiveRollout = simulateAdaptivePolicySelection(replay, options.adaptiveRollout || {});
    const drift = analyzeWindowedPerformance(summarized.outcomes, options.drift || {});
    const reliability = scoreAgentReliability(summarized.outcomes, options.reliability || {});
    const recommendations = buildLearningRecommendations(
        summarized,
        replay,
        adaptiveRollout,
        { drift, reliability },
        options.thresholds || {}
    );

    return {
        summary: summarized.summary,
        replay,
        adaptiveRollout,
        drift,
        reliability,
        recommendations
    };
}

export const __learningLoopInternals = {
    normalizeOutcome,
    normalizeVariant,
    latencyPercentiles,
    wilsonLowerBound,
    createSeededRandom,
    sampleBeta,
    computeRate
};
