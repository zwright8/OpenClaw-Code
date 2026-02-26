import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_continuous_improvement_planner',
    collectionField: 'improvements',
    idField: 'improvementId',
    defaultName: 'Engineering Improvement',
    readyPosture: 'engineering_continuous_improvement_planned',
    defaultAgentId: 'agent:engineering-continuous-improvement',
    recommendationTypes: {
        primary: 'plan_continuous_engineering_improvement',
        guard: 'mitigate_engineering_improvement_backlog_risk',
        audit: 'audit_engineering_continuous_improvement_signals',
        publish: 'publish_engineering_continuous_improvement_status'
    },
    recommendationTargetMap: {
        plan_continuous_engineering_improvement: 'agent:strategy',
        mitigate_engineering_improvement_backlog_risk: 'agent:operations',
        audit_engineering_continuous_improvement_signals: 'agent:trust',
        publish_engineering_continuous_improvement_status: 'agent:ops'
    }
});

export function planEngineeringContinuousImprovement(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringContinuousImprovementPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringContinuousImprovementPlanner extends BaseManager {}

export const __engineeringContinuousImprovementPlannerInternals = toolkit.internals;
