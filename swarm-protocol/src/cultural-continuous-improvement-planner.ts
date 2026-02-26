import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_continuous_improvement_planner',
    collectionField: 'improvements',
    idField: 'improvementId',
    defaultName: 'Cultural Improvement',
    readyPosture: 'cultural_continuous_improvement_ready',
    defaultAgentId: 'agent:cultural-continuous-improvement',
    recommendationTypes: {
        primary: 'plan_cultural_continuous_improvement',
        guard: 'mitigate_cultural_improvement_stagnation',
        audit: 'audit_cultural_continuous_improvement_signals',
        publish: 'publish_cultural_continuous_improvement_status'
    },
    recommendationTargetMap: {
        plan_cultural_continuous_improvement: 'agent:operations',
        mitigate_cultural_improvement_stagnation: 'agent:quality',
        audit_cultural_continuous_improvement_signals: 'agent:trust',
        publish_cultural_continuous_improvement_status: 'agent:ops'
    }
});

export function planCulturalContinuousImprovement(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalContinuousImprovementPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalContinuousImprovementPlanner extends BaseManager {}

export const __culturalContinuousImprovementPlannerInternals = toolkit.internals;
