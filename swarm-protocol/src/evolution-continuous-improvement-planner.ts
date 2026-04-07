import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_continuous_improvement_planner',
    collectionField: 'improvements',
    idField: 'improvementId',
    defaultName: 'Evolution Improvement',
    readyPosture: 'evolution_continuous_improvement_ready',
    defaultAgentId: 'agent:evolution-continuous-improvement',
    recommendationTypes: {
        primary: 'plan_evolution_continuous_improvement',
        guard: 'mitigate_evolution_improvement_stagnation',
        audit: 'audit_evolution_continuous_improvement_signals',
        publish: 'publish_evolution_continuous_improvement_status'
    },
    recommendationTargetMap: {
        plan_evolution_continuous_improvement: 'agent:operations',
        mitigate_evolution_improvement_stagnation: 'agent:quality',
        audit_evolution_continuous_improvement_signals: 'agent:trust',
        publish_evolution_continuous_improvement_status: 'agent:ops'
    }
});

export function planEvolutionContinuousImprovement(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionContinuousImprovementPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionContinuousImprovementPlanner extends BaseManager {}

export const __evolutionContinuousImprovementPlannerInternals = toolkit.internals;
