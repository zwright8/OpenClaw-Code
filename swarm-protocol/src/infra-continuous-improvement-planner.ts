import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_continuous_improvement_planner',
    collectionField: 'improvements',
    idField: 'improvementId',
    defaultName: 'Infra Improvement',
    readyPosture: 'infra_continuous_improvement_ready',
    defaultAgentId: 'agent:infra-continuous-improvement',
    recommendationTypes: {
        primary: 'plan_infra_continuous_improvement',
        guard: 'mitigate_infra_improvement_stagnation',
        audit: 'audit_infra_continuous_improvement_signals',
        publish: 'publish_infra_continuous_improvement_status'
    },
    recommendationTargetMap: {
        plan_infra_continuous_improvement: 'agent:operations',
        mitigate_infra_improvement_stagnation: 'agent:quality',
        audit_infra_continuous_improvement_signals: 'agent:trust',
        publish_infra_continuous_improvement_status: 'agent:ops'
    }
});

export function planInfraContinuousImprovement(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraContinuousImprovementPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraContinuousImprovementPlanner extends BaseManager {}

export const __infraContinuousImprovementPlannerInternals = toolkit.internals;
