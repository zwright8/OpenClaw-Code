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

function skillSuccessRate(skill) {
    const attempts = safeNumber(skill?.verification?.attempts);
    const successes = safeNumber(skill?.verification?.successes);
    if (attempts > 0) {
        return successes / attempts;
    }
    return safeNumber(skill?.qualityScore, 0.7);
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

export class DriftSentinel {
    constructor({
        localAgentId = 'agent:drift-sentinel',
        now = Date.now
    } = {}) {
        this.localAgentId = localAgentId;
        this.now = typeof now === 'function' ? now : Date.now;
        this.baseline = null;
        this.history = [];
    }

    setBaseline(snapshot) {
        if (!snapshot || typeof snapshot !== 'object') {
            throw new Error('setBaseline requires snapshot object');
        }

        this.baseline = {
            at: Number.isFinite(Number(snapshot.at))
                ? Number(snapshot.at)
                : safeNow(this.now),
            worldState: {
                avgEntityConfidence: safeNumber(snapshot?.worldState?.avgEntityConfidence),
                avgEdgeConfidence: safeNumber(snapshot?.worldState?.avgEdgeConfidence),
                entities: safeNumber(snapshot?.worldState?.entities),
                edges: safeNumber(snapshot?.worldState?.edges)
            },
            marketplace: {
                skills: Array.isArray(snapshot?.marketplace?.skills)
                    ? snapshot.marketplace.skills.map((skill) => ({
                        id: skill?.id || 'unknown',
                        status: skill?.status || 'active',
                        qualityScore: safeNumber(skill?.qualityScore, 0.7),
                        verification: {
                            attempts: safeNumber(skill?.verification?.attempts),
                            successes: safeNumber(skill?.verification?.successes),
                            failures: safeNumber(skill?.verification?.failures)
                        }
                    }))
                    : []
            },
            optimizer: {
                successRateAvg: safeNumber(snapshot?.optimizer?.successRateAvg),
                avgLatencyMs: safeNumber(snapshot?.optimizer?.avgLatencyMs),
                timeoutRateAvg: safeNumber(snapshot?.optimizer?.timeoutRateAvg)
            }
        };

        return clone(this.baseline);
    }

    getBaseline() {
        return this.baseline ? clone(this.baseline) : null;
    }

    evaluate(currentSnapshot, {
        entityConfidenceDropThreshold = 0.08,
        edgeConfidenceDropThreshold = 0.08,
        skillSuccessDropThreshold = 0.15,
        latencyIncreaseRatioThreshold = 0.25,
        timeoutIncreaseThreshold = 0.1
    } = {}) {
        if (!this.baseline) {
            throw new Error('DriftSentinel baseline not set');
        }

        const current = {
            at: Number.isFinite(Number(currentSnapshot?.at))
                ? Number(currentSnapshot.at)
                : safeNow(this.now),
            worldState: {
                avgEntityConfidence: safeNumber(currentSnapshot?.worldState?.avgEntityConfidence),
                avgEdgeConfidence: safeNumber(currentSnapshot?.worldState?.avgEdgeConfidence),
                entities: safeNumber(currentSnapshot?.worldState?.entities),
                edges: safeNumber(currentSnapshot?.worldState?.edges)
            },
            marketplace: {
                skills: Array.isArray(currentSnapshot?.marketplace?.skills)
                    ? currentSnapshot.marketplace.skills
                    : []
            },
            optimizer: {
                successRateAvg: safeNumber(currentSnapshot?.optimizer?.successRateAvg),
                avgLatencyMs: safeNumber(currentSnapshot?.optimizer?.avgLatencyMs),
                timeoutRateAvg: safeNumber(currentSnapshot?.optimizer?.timeoutRateAvg)
            }
        };

        const alerts = [];

        const entityDrop = this.baseline.worldState.avgEntityConfidence - current.worldState.avgEntityConfidence;
        if (entityDrop >= entityConfidenceDropThreshold) {
            alerts.push({
                code: 'world_state_entity_confidence_drop',
                priority: 'P1',
                summary: `Entity confidence dropped by ${entityDrop.toFixed(4)}`,
                target: 'world-state',
                metrics: {
                    baseline: this.baseline.worldState.avgEntityConfidence,
                    current: current.worldState.avgEntityConfidence,
                    delta: entityDrop
                }
            });
        }

        const edgeDrop = this.baseline.worldState.avgEdgeConfidence - current.worldState.avgEdgeConfidence;
        if (edgeDrop >= edgeConfidenceDropThreshold) {
            alerts.push({
                code: 'world_state_edge_confidence_drop',
                priority: 'P2',
                summary: `Edge confidence dropped by ${edgeDrop.toFixed(4)}`,
                target: 'world-state',
                metrics: {
                    baseline: this.baseline.worldState.avgEdgeConfidence,
                    current: current.worldState.avgEdgeConfidence,
                    delta: edgeDrop
                }
            });
        }

        const baselineSkills = new Map(this.baseline.marketplace.skills.map((skill) => [skill.id, skill]));
        for (const skill of current.marketplace.skills) {
            const baselineSkill = baselineSkills.get(skill.id);
            if (!baselineSkill) continue;

            const before = skillSuccessRate(baselineSkill);
            const after = skillSuccessRate(skill);
            const drop = before - after;

            if (drop >= skillSuccessDropThreshold) {
                alerts.push({
                    code: 'skill_success_rate_drop',
                    priority: 'P1',
                    summary: `Skill ${skill.id} success rate dropped by ${drop.toFixed(4)}`,
                    target: skill.id,
                    metrics: {
                        baseline: before,
                        current: after,
                        delta: drop
                    }
                });
            }

            if (String(skill.status) === 'retired') {
                alerts.push({
                    code: 'skill_retired',
                    priority: 'P2',
                    summary: `Skill ${skill.id} has retired`,
                    target: skill.id,
                    metrics: {}
                });
            }
        }

        const baseLatency = this.baseline.optimizer.avgLatencyMs;
        if (baseLatency > 0) {
            const increaseRatio = (current.optimizer.avgLatencyMs - baseLatency) / baseLatency;
            if (increaseRatio >= latencyIncreaseRatioThreshold) {
                alerts.push({
                    code: 'optimizer_latency_regression',
                    priority: 'P1',
                    summary: `Optimizer latency increased by ${(increaseRatio * 100).toFixed(2)}%`,
                    target: 'routing',
                    metrics: {
                        baseline: baseLatency,
                        current: current.optimizer.avgLatencyMs,
                        ratio: increaseRatio
                    }
                });
            }
        }

        const timeoutIncrease = current.optimizer.timeoutRateAvg - this.baseline.optimizer.timeoutRateAvg;
        if (timeoutIncrease >= timeoutIncreaseThreshold) {
            alerts.push({
                code: 'optimizer_timeout_regression',
                priority: 'P1',
                summary: `Optimizer timeout rate increased by ${timeoutIncrease.toFixed(4)}`,
                target: 'routing',
                metrics: {
                    baseline: this.baseline.optimizer.timeoutRateAvg,
                    current: current.optimizer.timeoutRateAvg,
                    delta: timeoutIncrease
                }
            });
        }

        const report = {
            at: current.at,
            baselineAt: this.baseline.at,
            alerts,
            baseline: clone(this.baseline),
            current: clone(current)
        };

        this.history.push(report);
        return report;
    }

    buildMitigationTasks(alerts, {
        defaultTarget = 'agent:ops',
        targetMap = {
            world_state_entity_confidence_drop: 'agent:knowledge',
            world_state_edge_confidence_drop: 'agent:knowledge',
            skill_success_rate_drop: 'agent:skills',
            skill_retired: 'agent:skills',
            optimizer_latency_regression: 'agent:routing',
            optimizer_timeout_regression: 'agent:routing'
        }
    } = {}) {
        const items = Array.isArray(alerts) ? alerts : [];
        const now = safeNow(this.now);

        return items.map((alert, index) => buildTaskRequest({
            id: randomUUID(),
            from: this.localAgentId,
            target: targetMap[alert.code] || defaultTarget,
            priority: normalizePriority(alert.priority),
            task: `[${alert.priority}] Investigate drift: ${alert.summary}`,
            context: {
                driftCode: alert.code,
                driftTarget: alert.target,
                metrics: alert.metrics,
                sentinel: 'drift-sentinel'
            },
            createdAt: now + index
        }));
    }

    listHistory({ limit = 50 } = {}) {
        return this.history
            .slice(-Math.max(1, Number(limit) || 50))
            .map((entry) => clone(entry));
    }
}

export const __driftInternals = {
    skillSuccessRate,
    normalizePriority
};
