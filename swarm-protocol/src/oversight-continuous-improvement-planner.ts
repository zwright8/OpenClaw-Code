import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_continuous_improvement_planner',
    collectionField: 'improvements',
    idField: 'improvementId',
    defaultName: 'Oversight Improvement',
    readyPosture: 'oversight_continuous_improvement_planned',
    defaultAgentId: 'agent:oversight-continuous-improvement',
    recommendationTypes: {
        primary: 'plan_continuous_oversight_improvement',
        guard: 'mitigate_oversight_improvement_backlog_risk',
        audit: 'audit_oversight_continuous_improvement_signals',
        publish: 'publish_oversight_continuous_improvement_status'
    },
    recommendationTargetMap: {
        plan_continuous_oversight_improvement: 'agent:strategy',
        mitigate_oversight_improvement_backlog_risk: 'agent:operations',
        audit_oversight_continuous_improvement_signals: 'agent:trust',
        publish_oversight_continuous_improvement_status: 'agent:ops'
    }
});

export function planOversightContinuousImprovement(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightContinuousImprovementPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightContinuousImprovementPlanner extends BaseManager {}

export const __oversightContinuousImprovementPlannerInternals = toolkit.internals;
