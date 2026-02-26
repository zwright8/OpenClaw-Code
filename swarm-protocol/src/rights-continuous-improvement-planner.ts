import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_continuous_improvement_planner',
    collectionField: 'improvements',
    idField: 'improvementId',
    defaultName: 'Rights Improvement',
    readyPosture: 'rights_continuous_improvement_ready',
    defaultAgentId: 'agent:rights-continuous-improvement',
    recommendationTypes: {
        primary: 'plan_rights_continuous_improvement',
        guard: 'mitigate_rights_improvement_stagnation',
        audit: 'audit_rights_continuous_improvement_signals',
        publish: 'publish_rights_continuous_improvement_status'
    },
    recommendationTargetMap: {
        plan_rights_continuous_improvement: 'agent:operations',
        mitigate_rights_improvement_stagnation: 'agent:quality',
        audit_rights_continuous_improvement_signals: 'agent:trust',
        publish_rights_continuous_improvement_status: 'agent:ops'
    }
});

export function planRightsContinuousImprovement(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsContinuousImprovementPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsContinuousImprovementPlanner extends BaseManager {}

export const __rightsContinuousImprovementPlannerInternals = toolkit.internals;
