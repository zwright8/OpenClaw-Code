import { TaskRequest } from './schemas.js';

const HEALTHY_STATUSES = new Set(['idle', 'busy']);

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

    const nowMs = Number.isFinite(options.nowMs) ? options.nowMs : Date.now();
    const maxStalenessMs = Number.isFinite(options.maxStalenessMs) ? options.maxStalenessMs : 60_000;
    const timestamp = Number(agent.timestamp ?? agent.lastHeartbeat ?? nowMs);
    if (Number.isFinite(timestamp) && nowMs - timestamp > maxStalenessMs) {
        return {
            eligible: false,
            score: -Infinity,
            reason: 'stale_heartbeat'
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
            missingCapabilities
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

    return {
        eligible: true,
        score: Number(score.toFixed(2)),
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
