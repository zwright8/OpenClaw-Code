import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

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

function normalizePriority(priority) {
    const map = {
        P0: 'critical',
        P1: 'high',
        P2: 'normal',
        P3: 'low'
    };
    return map[priority] || 'normal';
}

function incidentFingerprint(incident) {
    return `${incident.code}|${incident.target || ''}|${incident.windowStartAt}|${incident.windowEndAt}`;
}

export class RecoverySupervisor {
    constructor({
        localAgentId = 'agent:supervisor',
        now = Date.now,
        logger = console,
        maxSnapshots = 300
    } = {}) {
        this.localAgentId = localAgentId;
        this.now = typeof now === 'function' ? now : Date.now;
        this.logger = logger;
        this.maxSnapshots = Number.isInteger(maxSnapshots) && maxSnapshots > 0
            ? maxSnapshots
            : 300;
        this.snapshots = [];
        this.incidentHistory = [];
    }

    ingestSnapshot(snapshot) {
        const at = Number.isFinite(Number(snapshot?.at))
            ? Number(snapshot.at)
            : safeNow(this.now);

        const normalized = {
            at,
            orchestrator: {
                total: safeNumber(snapshot?.orchestrator?.total),
                open: safeNumber(snapshot?.orchestrator?.open),
                terminal: safeNumber(snapshot?.orchestrator?.terminal),
                avgAttempts: safeNumber(snapshot?.orchestrator?.avgAttempts),
                byStatus: {
                    ...(snapshot?.orchestrator?.byStatus || {})
                }
            },
            simulation: {
                successRate: safeNumber(snapshot?.simulation?.successRate),
                timeoutRate: safeNumber(snapshot?.simulation?.timeoutRate),
                failureRate: safeNumber(snapshot?.simulation?.failureRate),
                avgLatencyMs: safeNumber(snapshot?.simulation?.avgLatencyMs),
                dispatchErrorCount: safeNumber(snapshot?.simulation?.dispatchErrorCount)
            },
            agents: Array.isArray(snapshot?.agents)
                ? snapshot.agents.map((agent) => ({
                    agentId: agent?.agentId || agent?.id || 'unknown',
                    status: agent?.status || 'unknown',
                    load: safeNumber(agent?.load),
                    tasks: safeNumber(agent?.tasks),
                    successRate: safeNumber(agent?.successRate),
                    timeoutRate: safeNumber(agent?.timeoutRate)
                }))
                : []
        };

        this.snapshots.push(normalized);
        if (this.snapshots.length > this.maxSnapshots) {
            this.snapshots.splice(0, this.snapshots.length - this.maxSnapshots);
        }

        return clone(normalized);
    }

    latestSnapshot() {
        if (this.snapshots.length === 0) return null;
        return clone(this.snapshots[this.snapshots.length - 1]);
    }

    detectIncidents({
        lookback = 20,
        timeoutRateThreshold = 0.18,
        failureRateThreshold = 0.2,
        avgAttemptsThreshold = 1.6,
        dispatchErrorThreshold = 3,
        agentSuccessRateThreshold = 0.6,
        agentTimeoutRateThreshold = 0.25,
        agentOverloadThreshold = 0.9
    } = {}) {
        const window = this.snapshots.slice(-Math.max(1, Number(lookback) || 20));
        if (window.length === 0) {
            return {
                incidents: [],
                windowStartAt: null,
                windowEndAt: null
            };
        }

        const startAt = window[0].at;
        const endAt = window[window.length - 1].at;
        const incidents = [];

        const avgTimeoutRate = window.reduce((acc, row) => acc + row.simulation.timeoutRate, 0) / window.length;
        const avgFailureRate = window.reduce((acc, row) => acc + row.simulation.failureRate, 0) / window.length;
        const avgAttempts = window.reduce((acc, row) => acc + row.orchestrator.avgAttempts, 0) / window.length;
        const totalDispatchErrors = window.reduce((acc, row) => acc + row.simulation.dispatchErrorCount, 0);

        if (avgTimeoutRate >= timeoutRateThreshold) {
            incidents.push({
                code: 'timeout_spike',
                priority: 'P1',
                severity: 'high',
                target: 'global',
                summary: `Timeout rate ${avgTimeoutRate.toFixed(4)} exceeded ${timeoutRateThreshold}`,
                metrics: {
                    avgTimeoutRate,
                    threshold: timeoutRateThreshold
                },
                windowStartAt: startAt,
                windowEndAt: endAt
            });
        }

        if (avgFailureRate >= failureRateThreshold) {
            incidents.push({
                code: 'failure_spike',
                priority: 'P1',
                severity: 'high',
                target: 'global',
                summary: `Failure rate ${avgFailureRate.toFixed(4)} exceeded ${failureRateThreshold}`,
                metrics: {
                    avgFailureRate,
                    threshold: failureRateThreshold
                },
                windowStartAt: startAt,
                windowEndAt: endAt
            });
        }

        if (avgAttempts >= avgAttemptsThreshold) {
            incidents.push({
                code: 'retry_pressure',
                priority: 'P2',
                severity: 'medium',
                target: 'global',
                summary: `Average attempts ${avgAttempts.toFixed(2)} exceeded ${avgAttemptsThreshold}`,
                metrics: {
                    avgAttempts,
                    threshold: avgAttemptsThreshold
                },
                windowStartAt: startAt,
                windowEndAt: endAt
            });
        }

        if (totalDispatchErrors >= dispatchErrorThreshold) {
            incidents.push({
                code: 'dispatch_error_cluster',
                priority: 'P1',
                severity: 'high',
                target: 'global',
                summary: `Dispatch error count ${totalDispatchErrors} exceeded ${dispatchErrorThreshold}`,
                metrics: {
                    totalDispatchErrors,
                    threshold: dispatchErrorThreshold
                },
                windowStartAt: startAt,
                windowEndAt: endAt
            });
        }

        const latest = window[window.length - 1];
        for (const agent of latest.agents) {
            if (agent.successRate > 0 && agent.successRate < agentSuccessRateThreshold) {
                incidents.push({
                    code: 'agent_low_success',
                    priority: 'P2',
                    severity: 'medium',
                    target: agent.agentId,
                    summary: `Agent ${agent.agentId} success rate ${agent.successRate.toFixed(4)} below ${agentSuccessRateThreshold}`,
                    metrics: {
                        successRate: agent.successRate,
                        threshold: agentSuccessRateThreshold
                    },
                    windowStartAt: startAt,
                    windowEndAt: endAt
                });
            }

            if (agent.timeoutRate >= agentTimeoutRateThreshold) {
                incidents.push({
                    code: 'agent_timeout_hotspot',
                    priority: 'P1',
                    severity: 'high',
                    target: agent.agentId,
                    summary: `Agent ${agent.agentId} timeout rate ${agent.timeoutRate.toFixed(4)} exceeded ${agentTimeoutRateThreshold}`,
                    metrics: {
                        timeoutRate: agent.timeoutRate,
                        threshold: agentTimeoutRateThreshold
                    },
                    windowStartAt: startAt,
                    windowEndAt: endAt
                });
            }

            if (agent.load >= agentOverloadThreshold) {
                incidents.push({
                    code: 'agent_overloaded',
                    priority: 'P1',
                    severity: 'high',
                    target: agent.agentId,
                    summary: `Agent ${agent.agentId} load ${agent.load.toFixed(4)} exceeded ${agentOverloadThreshold}`,
                    metrics: {
                        load: agent.load,
                        threshold: agentOverloadThreshold
                    },
                    windowStartAt: startAt,
                    windowEndAt: endAt
                });
            }
        }

        const deduped = new Map();
        for (const incident of incidents) {
            const key = incidentFingerprint(incident);
            deduped.set(key, incident);
        }

        const list = [...deduped.values()].sort((a, b) => {
            const priorityOrder = { P0: 0, P1: 1, P2: 2, P3: 3 };
            return (priorityOrder[a.priority] || 9) - (priorityOrder[b.priority] || 9);
        });

        return {
            incidents: list,
            windowStartAt: startAt,
            windowEndAt: endAt
        };
    }

    proposeActions(incidents, {
        maxActions = 10
    } = {}) {
        const source = Array.isArray(incidents) ? incidents : [];
        const actions = [];

        for (const incident of source) {
            if (incident.code === 'timeout_spike') {
                actions.push({
                    incidentCode: incident.code,
                    priority: 'P1',
                    actionType: 'benchmark_rerun',
                    target: 'global',
                    title: 'Run targeted timeout benchmark and apply fallback routing',
                    description: incident.summary
                });
                actions.push({
                    incidentCode: incident.code,
                    priority: 'P1',
                    actionType: 'increase_retry_delay',
                    target: 'global',
                    title: 'Increase retry delay to reduce retry storms',
                    description: incident.summary
                });
            }

            if (incident.code === 'failure_spike' || incident.code === 'dispatch_error_cluster') {
                actions.push({
                    incidentCode: incident.code,
                    priority: 'P1',
                    actionType: 'route_to_stable_pool',
                    target: 'global',
                    title: 'Route critical tasks to proven stable agent pool',
                    description: incident.summary
                });
            }

            if (incident.code === 'agent_overloaded' || incident.code === 'agent_timeout_hotspot') {
                actions.push({
                    incidentCode: incident.code,
                    priority: 'P1',
                    actionType: 'drain_agent',
                    target: incident.target,
                    title: `Drain and reroute load from ${incident.target}`,
                    description: incident.summary
                });
            }

            if (incident.code === 'agent_low_success') {
                actions.push({
                    incidentCode: incident.code,
                    priority: 'P2',
                    actionType: 'deprioritize_agent',
                    target: incident.target,
                    title: `Reduce routing weight for ${incident.target}`,
                    description: incident.summary
                });
            }

            if (incident.code === 'retry_pressure') {
                actions.push({
                    incidentCode: incident.code,
                    priority: 'P2',
                    actionType: 'tune_timeout_budget',
                    target: 'global',
                    title: 'Tune timeout budgets and queue deadlines',
                    description: incident.summary
                });
            }
        }

        const unique = new Map();
        for (const action of actions) {
            const key = `${action.actionType}|${action.target}`;
            if (!unique.has(key)) {
                unique.set(key, action);
            }
        }

        return [...unique.values()].slice(0, Math.max(1, Number(maxActions) || 10));
    }

    buildRecoveryTasks(actions, {
        defaultTarget = 'agent:ops',
        targetMap = {
            drain_agent: 'agent:ops',
            deprioritize_agent: 'agent:routing',
            route_to_stable_pool: 'agent:routing',
            benchmark_rerun: 'agent:simulation',
            increase_retry_delay: 'agent:ops',
            tune_timeout_budget: 'agent:ops'
        }
    } = {}) {
        const items = Array.isArray(actions) ? actions : [];
        const now = safeNow(this.now);

        return items.map((action, index) => buildTaskRequest({
            id: randomUUID(),
            from: this.localAgentId,
            target: targetMap[action.actionType] || defaultTarget,
            priority: normalizePriority(action.priority),
            task: `[${action.priority}] ${action.title}`,
            context: {
                supervisor: 'recovery-supervisor',
                incidentCode: action.incidentCode,
                actionType: action.actionType,
                target: action.target,
                description: action.description
            },
            createdAt: now + index
        }));
    }

    evaluateAndPlan(options = {}) {
        const detected = this.detectIncidents(options.thresholds || {});
        const actions = this.proposeActions(detected.incidents, options.actions || {});
        const tasks = this.buildRecoveryTasks(actions, options.tasks || {});

        const record = {
            at: safeNow(this.now),
            incidents: clone(detected.incidents),
            actions: clone(actions),
            taskCount: tasks.length
        };
        this.incidentHistory.push(record);

        return {
            windowStartAt: detected.windowStartAt,
            windowEndAt: detected.windowEndAt,
            incidents: detected.incidents,
            actions,
            tasks
        };
    }

    listIncidentHistory({ limit = 50 } = {}) {
        return this.incidentHistory
            .slice(-Math.max(1, Number(limit) || 50))
            .map((entry) => clone(entry));
    }
}

export const __recoveryInternals = {
    normalizePriority
};
