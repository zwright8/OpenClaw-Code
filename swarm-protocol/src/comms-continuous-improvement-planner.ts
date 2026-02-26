import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_continuous_improvement_planner',
    collectionField: 'improvements',
    idField: 'improvementId',
    defaultName: 'Comms Improvement',
    readyPosture: 'comms_continuous_improvement_ready',
    defaultAgentId: 'agent:comms-continuous-improvement',
    recommendationTypes: {
        primary: 'plan_comms_continuous_improvement',
        guard: 'mitigate_comms_improvement_stagnation',
        audit: 'audit_comms_continuous_improvement_signals',
        publish: 'publish_comms_continuous_improvement_status'
    },
    recommendationTargetMap: {
        plan_comms_continuous_improvement: 'agent:operations',
        mitigate_comms_improvement_stagnation: 'agent:quality',
        audit_comms_continuous_improvement_signals: 'agent:trust',
        publish_comms_continuous_improvement_status: 'agent:ops'
    }
});

export function planCommsContinuousImprovement(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsContinuousImprovementPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsContinuousImprovementPlanner extends BaseManager {}

export const __commsContinuousImprovementPlannerInternals = toolkit.internals;
