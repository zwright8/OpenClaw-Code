import type {
    SkillExecutionTask,
    SkillPriority,
    SkillRolloutPlan,
    SkillRolloutPlanEntry,
    SkillRolloutWave,
    SkillRolloutWaveConfig,
    SkillRolloutWaveEntry,
    SkillRolloutWavePlan
} from './types.js';

type OrchestrationOptions = Partial<SkillRolloutWaveConfig>;

type TaskOptions = {
    fromAgentId?: string;
};

type Lane = 'now' | 'next';

const DEFAULT_FROM_AGENT = 'agent:skills-rollout-orchestrator';

const DEFAULT_CONFIG: SkillRolloutWaveConfig = {
    nowWaveCapacity: 32,
    nextWaveCapacity: 48,
    maxPerDomainPerWave: 3
};

function roundScore(value: number): number {
    return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeConfig(options: OrchestrationOptions = {}): SkillRolloutWaveConfig {
    const nowWaveCapacity = Math.max(8, Math.floor(Number(options.nowWaveCapacity || DEFAULT_CONFIG.nowWaveCapacity)));
    const nextWaveCapacity = Math.max(8, Math.floor(Number(options.nextWaveCapacity || DEFAULT_CONFIG.nextWaveCapacity)));
    const maxPerDomainPerWave = Math.max(
        1,
        Math.floor(Number(options.maxPerDomainPerWave || DEFAULT_CONFIG.maxPerDomainPerWave))
    );

    return {
        nowWaveCapacity,
        nextWaveCapacity,
        maxPerDomainPerWave
    };
}

function sortLaneEntries(entries: SkillRolloutPlanEntry[], lane: Lane): SkillRolloutPlanEntry[] {
    return entries
        .filter((entry) => entry.lane === lane)
        .slice()
        .sort((a, b) => {
            const readinessDelta = b.readinessIndex - a.readinessIndex;
            if (readinessDelta !== 0) return readinessDelta;
            const riskDelta = a.riskIndex - b.riskIndex;
            if (riskDelta !== 0) return riskDelta;
            return a.skillId - b.skillId;
        });
}

function toInternalPriority(lane: Lane, riskIndex: number): SkillPriority {
    if (lane === 'next') {
        return riskIndex >= 52 ? 'P0' : 'P1';
    }
    return riskIndex >= 48 ? 'P1' : 'P2';
}

function finalizeWave(internalWave: {
    waveId: string;
    lane: Lane;
    waveIndex: number;
    capacity: number;
    entries: SkillRolloutWaveEntry[];
    domainCounts: Map<string, number>;
}): SkillRolloutWave {
    const avgReadiness = internalWave.entries.length === 0
        ? 0
        : roundScore(internalWave.entries.reduce((sum, entry) => sum + entry.readinessIndex, 0) / internalWave.entries.length);
    const avgRisk = internalWave.entries.length === 0
        ? 0
        : roundScore(internalWave.entries.reduce((sum, entry) => sum + entry.riskIndex, 0) / internalWave.entries.length);

    const domainLoad = Array.from(internalWave.domainCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([domain, count]) => ({ domain, count }));

    return {
        waveId: internalWave.waveId,
        lane: internalWave.lane,
        waveIndex: internalWave.waveIndex,
        capacity: internalWave.capacity,
        entryCount: internalWave.entries.length,
        avgReadiness,
        avgRisk,
        domainLoad,
        entries: internalWave.entries
    };
}

function allocateLaneWaves(args: {
    lane: Lane;
    entries: SkillRolloutPlanEntry[];
    capacity: number;
    maxPerDomainPerWave: number;
    startExecutionOrder: number;
}): { waves: SkillRolloutWave[]; nextExecutionOrder: number; } {
    const { lane, entries, capacity, maxPerDomainPerWave } = args;
    let executionOrder = args.startExecutionOrder;
    const waves: Array<{
        waveId: string;
        lane: Lane;
        waveIndex: number;
        capacity: number;
        entries: SkillRolloutWaveEntry[];
        domainCounts: Map<string, number>;
    }> = [];

    const ensureWave = () => {
        const waveIndex = waves.length + 1;
        const waveId = `${lane}-${String(waveIndex).padStart(2, '0')}`;
        const next = {
            waveId,
            lane,
            waveIndex,
            capacity,
            entries: [],
            domainCounts: new Map<string, number>()
        };
        waves.push(next);
        return next;
    };

    for (const entry of entries) {
        let selected = waves.find((wave) => (
            wave.entries.length < wave.capacity
            && (wave.domainCounts.get(entry.domain) || 0) < maxPerDomainPerWave
        ));
        if (!selected) {
            selected = ensureWave();
        }

        const waveEntry: SkillRolloutWaveEntry = {
            skillId: entry.skillId,
            skillName: entry.skillName,
            title: entry.title,
            domain: entry.domain,
            domainSlug: entry.domainSlug,
            archetype: entry.archetype,
            lane,
            waveId: selected.waveId,
            waveIndex: selected.waveIndex,
            executionOrder,
            priority: toInternalPriority(lane, entry.riskIndex),
            readinessIndex: entry.readinessIndex,
            riskIndex: entry.riskIndex,
            featureFlag: entry.featureFlag,
            requiredApprovalGates: entry.requiredApprovalGates,
            reasons: entry.reasons
        };
        executionOrder += 1;

        selected.entries.push(waveEntry);
        selected.domainCounts.set(entry.domain, (selected.domainCounts.get(entry.domain) || 0) + 1);
    }

    return {
        waves: waves.map(finalizeWave),
        nextExecutionOrder: executionOrder
    };
}

function buildOversightQueue(entries: SkillRolloutPlanEntry[]) {
    return entries
        .filter((entry) => entry.lane === 'hold')
        .slice()
        .sort((a, b) => {
            const riskDelta = b.riskIndex - a.riskIndex;
            if (riskDelta !== 0) return riskDelta;
            return a.readinessIndex - b.readinessIndex;
        })
        .map((entry, index) => ({
            position: index + 1,
            skillId: entry.skillId,
            skillName: entry.skillName,
            title: entry.title,
            domain: entry.domain,
            archetype: entry.archetype,
            readinessIndex: entry.readinessIndex,
            riskIndex: entry.riskIndex,
            priority: 'P0' as SkillPriority,
            reasons: entry.reasons,
            requiredApprovalGates: entry.requiredApprovalGates
        }));
}

export function buildSkillRolloutWavePlan(
    plan: SkillRolloutPlan,
    options: OrchestrationOptions = {}
): SkillRolloutWavePlan {
    const config = normalizeConfig(options);
    const nowEntries = sortLaneEntries(plan.entries, 'now');
    const nextEntries = sortLaneEntries(plan.entries, 'next');

    const allocatedNow = allocateLaneWaves({
        lane: 'now',
        entries: nowEntries,
        capacity: config.nowWaveCapacity,
        maxPerDomainPerWave: config.maxPerDomainPerWave,
        startExecutionOrder: 1
    });
    const allocatedNext = allocateLaneWaves({
        lane: 'next',
        entries: nextEntries,
        capacity: config.nextWaveCapacity,
        maxPerDomainPerWave: config.maxPerDomainPerWave,
        startExecutionOrder: allocatedNow.nextExecutionOrder
    });
    const waves = [...allocatedNow.waves, ...allocatedNext.waves];
    const oversightQueue = buildOversightQueue(plan.entries);

    const avgWaveFillRate = waves.length === 0
        ? 0
        : Number(
            (
                waves.reduce((sum, wave) => sum + (wave.entryCount / Math.max(1, wave.capacity)), 0)
                / waves.length
            ).toFixed(3)
        );

    return {
        generatedAt: new Date().toISOString(),
        sourcePlanGeneratedAt: plan.generatedAt,
        config,
        summary: {
            scheduledSkills: waves.reduce((sum, wave) => sum + wave.entryCount, 0),
            oversightSkills: oversightQueue.length,
            waveCounts: {
                now: allocatedNow.waves.length,
                next: allocatedNext.waves.length
            },
            avgWaveFillRate
        },
        waves,
        oversightQueue
    };
}

export function rolloutWavePlanToTasks(
    wavePlan: SkillRolloutWavePlan,
    options: TaskOptions = {}
): SkillExecutionTask[] {
    const fromAgentId = options.fromAgentId || DEFAULT_FROM_AGENT;
    const tasks: SkillExecutionTask[] = [];

    for (const wave of wavePlan.waves) {
        tasks.push({
            kind: 'task_request',
            id: `wave-kickoff-${wave.waveId}`,
            from: fromAgentId,
            to: 'agent:rollout-controller',
            task: `Kick off rollout wave ${wave.waveId} (${wave.lane})`,
            priority: wave.lane === 'now' ? 'P1' : 'P2',
            context: {
                waveId: wave.waveId,
                lane: wave.lane,
                capacity: wave.capacity,
                entryCount: wave.entryCount,
                avgReadiness: wave.avgReadiness,
                avgRisk: wave.avgRisk,
                domainLoad: wave.domainLoad
            }
        });

        for (const entry of wave.entries) {
            tasks.push({
                kind: 'task_request',
                id: `wave-${wave.waveId}-${String(entry.skillId).padStart(4, '0')}`,
                from: fromAgentId,
                to: `agent:${entry.domainSlug}-swarm`,
                task: wave.lane === 'now'
                    ? `Deploy runtime skill ${entry.title} in wave ${wave.waveId}`
                    : `Stage runtime skill ${entry.title} for wave ${wave.waveId}`,
                priority: entry.priority,
                context: {
                    skillId: entry.skillId,
                    skillName: entry.skillName,
                    waveId: wave.waveId,
                    waveIndex: wave.waveIndex,
                    executionOrder: entry.executionOrder,
                    readinessIndex: entry.readinessIndex,
                    riskIndex: entry.riskIndex,
                    featureFlag: entry.featureFlag,
                    requiredApprovalGates: entry.requiredApprovalGates,
                    reasons: entry.reasons
                }
            });
        }
    }

    for (const item of wavePlan.oversightQueue) {
        tasks.push({
            kind: 'task_request',
            id: `oversight-${String(item.skillId).padStart(4, '0')}`,
            from: fromAgentId,
            to: 'agent:human-oversight',
            task: `Triage hold-lane skill ${item.title} (queue #${item.position})`,
            priority: 'P0',
            context: {
                skillId: item.skillId,
                skillName: item.skillName,
                queuePosition: item.position,
                domain: item.domain,
                archetype: item.archetype,
                readinessIndex: item.readinessIndex,
                riskIndex: item.riskIndex,
                reasons: item.reasons,
                requiredApprovalGates: item.requiredApprovalGates
            }
        });
    }

    return tasks;
}
