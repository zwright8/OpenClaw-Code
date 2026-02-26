import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_continuous_improvement_planner',
    collectionField: 'improvements',
    idField: 'improvementId',
    defaultName: 'Education Improvement',
    readyPosture: 'education_continuous_improvement_planned',
    defaultAgentId: 'agent:education-continuous-improvement',
    recommendationTypes: {
        primary: 'plan_continuous_education_improvement',
        guard: 'mitigate_education_improvement_backlog_risk',
        audit: 'audit_education_continuous_improvement_signals',
        publish: 'publish_education_continuous_improvement_status'
    },
    recommendationTargetMap: {
        plan_continuous_education_improvement: 'agent:strategy',
        mitigate_education_improvement_backlog_risk: 'agent:operations',
        audit_education_continuous_improvement_signals: 'agent:trust',
        publish_education_continuous_improvement_status: 'agent:ops'
    }
});

export function planEducationContinuousImprovement(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationContinuousImprovementPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationContinuousImprovementPlanner extends BaseManager {}

export const __educationContinuousImprovementPlannerInternals = toolkit.internals;
