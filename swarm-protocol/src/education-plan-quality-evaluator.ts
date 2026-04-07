import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_plan_quality_evaluator',
    collectionField: 'plans',
    idField: 'planId',
    defaultName: 'Education Plan',
    readyPosture: 'education_plan_quality_assured',
    defaultAgentId: 'agent:education-plan-quality',
    recommendationTypes: {
        primary: 'evaluate_education_plan_quality',
        guard: 'mitigate_education_plan_feasibility_risk',
        audit: 'audit_education_plan_quality_signals',
        publish: 'publish_education_plan_quality_status'
    },
    recommendationTargetMap: {
        evaluate_education_plan_quality: 'agent:education',
        mitigate_education_plan_feasibility_risk: 'agent:policy',
        audit_education_plan_quality_signals: 'agent:trust',
        publish_education_plan_quality_status: 'agent:ops'
    }
});

export function evaluateEducationPlanQuality(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationPlanQualityEvaluatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationPlanQualityEvaluator extends BaseManager {}

export const __educationPlanQualityEvaluatorInternals = toolkit.internals;
