import { TaskRequest } from './schemas.js';

const HEALTHY_STATUSES = new Set(['idle', 'busy']);
const DEFAULT_STALE_HEARTBEAT_PENALTY = 35;
const DEFAULT_PANIC_HEALTHY_RATIO_THRESHOLD = 0.5;

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

function clampLoad(value, fallback = 0.5) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return Math.max(0, Math.min(1, numeric));
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

function pickBestEligible(ranked, options = {}) {
    const eligible = ranked.filter((item) => item.eligible && typeof item.agentId === 'string' && item.agentId.trim());
    if (eligible.length === 0) return null;
    if (options.selectionStrategy === 'p2c') {
        return pickWithPowerOfTwoChoices(eligible, options);
    }
    return eligible[0];
}

function scoreAgent(taskRequest, agent, options) {
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

    const score = computeBaseScore(taskRequest, {
        load,
        status,
        requiredCapabilities
    });

    if (stale) {
        const stalePenalty = Number.isFinite(options.staleHeartbeatPenalty)
            ? Number(options.staleHeartbeatPenalty)
            : DEFAULT_STALE_HEARTBEAT_PENALTY;
        return {
            eligible: false,
            degradedEligible: true,
            score: Number((score - stalePenalty).toFixed(2)),
            reason: 'stale_heartbeat',
            missingCapabilities: []
        };
    }

    return {
        eligible: true,
        degradedEligible: false,
        score,
        reason: 'ok',
        missingCapabilities: []
    };
}

export function rankAgentsForTask(taskRequestPayload, agents, options = {}) {
    const taskRequest = TaskRequest.parse(taskRequestPayload);
    if (!Array.isArray(agents)) {
        throw new Error('agents must be an array');
    }

    return agents
        .map((agent) => {
            const evaluation = scoreAgent(taskRequest, agent, options);
            return {
                agentId: agent?.id || agent?.agentId || null,
                status: agent?.status,
                load: agent?.load,
                capabilities: normalizeCapabilities(agent?.capabilities),
                ...evaluation
            };
        })
        .sort((a, b) => b.score - a.score);
}

export function selectBestAgentForTask(taskRequestPayload, agents, options = {}) {
    const ranked = rankAgentsForTask(taskRequestPayload, agents, options);
    const best = pickBestEligible(ranked, options);

    return {
        selectedAgentId: best?.agentId || null,
        ranked
    };
}

export function routeTaskRequest(taskRequestPayload, agents, options = {}) {
    const taskRequest = TaskRequest.parse(taskRequestPayload);
    const selection = selectBestAgentForTask(taskRequest, agents, options);

    if (!selection.selectedAgentId) {
        const ranked = selection.ranked;
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
        ranked: selection.ranked,
        taskRequest: {
            ...taskRequest,
            target: selection.selectedAgentId
        }
    };
}
