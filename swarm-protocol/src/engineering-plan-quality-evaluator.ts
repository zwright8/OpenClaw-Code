import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_plan_quality_evaluator',
    collectionField: 'plans',
    idField: 'planId',
    defaultName: 'Engineering Plan',
    readyPosture: 'engineering_plan_quality_assured',
    defaultAgentId: 'agent:engineering-plan-quality',
    recommendationTypes: {
        primary: 'evaluate_engineering_plan_quality',
        guard: 'mitigate_engineering_plan_feasibility_risk',
        audit: 'audit_engineering_plan_quality_signals',
        publish: 'publish_engineering_plan_quality_status'
    },
    recommendationTargetMap: {
        evaluate_engineering_plan_quality: 'agent:engineering',
        mitigate_engineering_plan_feasibility_risk: 'agent:policy',
        audit_engineering_plan_quality_signals: 'agent:trust',
        publish_engineering_plan_quality_status: 'agent:ops'
    }
});

export function evaluateEngineeringPlanQuality(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringPlanQualityEvaluatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringPlanQualityEvaluator extends BaseManager {}

export const __engineeringPlanQualityEvaluatorInternals = toolkit.internals;
