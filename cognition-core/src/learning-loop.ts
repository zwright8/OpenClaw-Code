function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function mean(values) {
    if (!Array.isArray(values) || values.length === 0) return 0;
    return values.reduce((acc, value) => acc + value, 0) / values.length;
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
        successRate: 0,
        timeoutRate: 0,
        byStatus: {},
        byAgent: {},
        byPriority: {}
    };

    const latencies = [];
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
                avgLatencyMs: 0
            };
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
        const agentLatencies = normalized
            .filter((item) => item.target === agentId && Number.isFinite(item.latencyMs))
            .map((item) => item.latencyMs);
        agent.avgLatencyMs = agentLatencies.length > 0
            ? Number(mean(agentLatencies).toFixed(2))
            : 0;
        agent.successRate = agent.tasks > 0
            ? Number((agent.success / agent.tasks).toFixed(4))
            : 0;
        agent.timeoutRate = agent.tasks > 0
            ? Number((agent.timedOut / agent.tasks).toFixed(4))
            : 0;
    }

    totals.avgAttempts = totals.total > 0
        ? Number((attemptsTotal / totals.total).toFixed(2))
        : 0;
    totals.avgLatencyMs = latencies.length > 0
        ? Number(mean(latencies).toFixed(2))
        : 0;
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

export function buildLearningRecommendations(
    summary,
    replay,
    {
        minTimeoutRateForAction = 0.1,
        minAgentSuccessRate = 0.7,
        maxAvgAttempts = 1.4
    } = {}
) {
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

    const lowPerformers = Object.entries(baseline.byAgent || {})
        .filter(([, stats]) => Number(stats.successRate || 0) < minAgentSuccessRate)
        .sort((a, b) => (a[1].successRate || 0) - (b[1].successRate || 0));

    for (const [agentId, stats] of lowPerformers.slice(0, 2)) {
        recommendations.push({
            priority: 'P2',
            category: 'routing_quality',
            title: `Improve routing quality for ${agentId}`,
            rationale: `Agent success rate is ${(stats.successRate * 100).toFixed(1)}% across ${stats.tasks} tasks`,
            action: 'Apply optimizer penalties for this agent until reliability recovers and add targeted health checks.',
            expectedImpact: {
                metric: `${agentId}.successRate`,
                current: stats.successRate,
                target: Number(Math.min(0.95, stats.successRate + 0.12).toFixed(4))
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

    return recommendations;
}

export function evaluateLearningLoop(outcomes, options = {}) {
    if (!Array.isArray(outcomes)) {
        throw new Error('evaluateLearningLoop expects outcomes array');
    }

    const summarized = summarizeOutcomes(outcomes);
    const replay = runCounterfactualReplay(summarized, options.variants);
    const recommendations = buildLearningRecommendations(
        summarized,
        replay,
        options.thresholds || {}
    );

    return {
        summary: summarized.summary,
        replay,
        recommendations
    };
}

export const __learningLoopInternals = {
    normalizeOutcome,
    normalizeVariant
};
