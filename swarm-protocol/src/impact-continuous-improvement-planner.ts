import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_continuous_improvement_planner',
    collectionField: 'improvements',
    idField: 'improvementId',
    defaultName: 'Impact Improvement',
    readyPosture: 'impact_continuous_improvement_ready',
    defaultAgentId: 'agent:impact-continuous-improvement',
    recommendationTypes: {
        primary: 'plan_impact_continuous_improvement',
        guard: 'mitigate_impact_improvement_stagnation',
        audit: 'audit_impact_continuous_improvement_signals',
        publish: 'publish_impact_continuous_improvement_status'
    },
    recommendationTargetMap: {
        plan_impact_continuous_improvement: 'agent:operations',
        mitigate_impact_improvement_stagnation: 'agent:quality',
        audit_impact_continuous_improvement_signals: 'agent:trust',
        publish_impact_continuous_improvement_status: 'agent:ops'
    }
});

export function planImpactContinuousImprovement(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactContinuousImprovementPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactContinuousImprovementPlanner extends BaseManager {}

export const __impactContinuousImprovementPlannerInternals = toolkit.internals;
