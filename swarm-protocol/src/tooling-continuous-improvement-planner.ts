import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'tooling_continuous_improvement_planner',
    collectionField: 'improvements',
    idField: 'improvementId',
    defaultName: 'Improvement',
    readyPosture: 'continuous_improvement_planned',
    defaultAgentId: 'agent:tooling-continuous-improvement',
    recommendationTypes: {
        primary: 'plan_continuous_tooling_improvement',
        guard: 'mitigate_improvement_backlog_risk',
        audit: 'audit_continuous_improvement_signals',
        publish: 'publish_continuous_improvement_status'
    },
    recommendationTargetMap: {
        plan_continuous_tooling_improvement: 'agent:strategy',
        mitigate_improvement_backlog_risk: 'agent:operations',
        audit_continuous_improvement_signals: 'agent:trust',
        publish_continuous_improvement_status: 'agent:ops'
    }
});

export function planToolingContinuousImprovement(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function toolingContinuousImprovementPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ToolingContinuousImprovementPlanner extends BaseManager {}

export const __toolingContinuousImprovementPlannerInternals = toolkit.internals;
