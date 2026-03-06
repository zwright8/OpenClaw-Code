import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_continuous_improvement_planner',
    collectionField: 'improvements',
    idField: 'improvementId',
    defaultName: 'Inclusion Improvement',
    readyPosture: 'inclusion_continuous_improvement_ready',
    defaultAgentId: 'agent:inclusion-continuous-improvement',
    recommendationTypes: {
        primary: 'plan_inclusion_continuous_improvement',
        guard: 'mitigate_inclusion_improvement_stagnation',
        audit: 'audit_inclusion_continuous_improvement_signals',
        publish: 'publish_inclusion_continuous_improvement_status'
    },
    recommendationTargetMap: {
        plan_inclusion_continuous_improvement: 'agent:operations',
        mitigate_inclusion_improvement_stagnation: 'agent:quality',
        audit_inclusion_continuous_improvement_signals: 'agent:trust',
        publish_inclusion_continuous_improvement_status: 'agent:ops'
    }
});

export function planInclusionContinuousImprovement(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionContinuousImprovementPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionContinuousImprovementPlanner extends BaseManager {}

export const __inclusionContinuousImprovementPlannerInternals = toolkit.internals;
