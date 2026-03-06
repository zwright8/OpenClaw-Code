import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_plan_quality_evaluator',
    collectionField: 'plans',
    idField: 'planId',
    defaultName: 'Crisis Plan',
    readyPosture: 'crisis_plan_quality_assured',
    defaultAgentId: 'agent:crisis-plan-quality',
    recommendationTypes: {
        primary: 'evaluate_crisis_plan_quality',
        guard: 'mitigate_crisis_plan_feasibility_risk',
        audit: 'audit_crisis_plan_quality_signals',
        publish: 'publish_crisis_plan_quality_status'
    },
    recommendationTargetMap: {
        evaluate_crisis_plan_quality: 'agent:crisis',
        mitigate_crisis_plan_feasibility_risk: 'agent:policy',
        audit_crisis_plan_quality_signals: 'agent:trust',
        publish_crisis_plan_quality_status: 'agent:ops'
    }
});

export function evaluateCrisisPlanQuality(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisPlanQualityEvaluatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisPlanQualityEvaluator extends BaseManager {}

export const __crisisPlanQualityEvaluatorInternals = toolkit.internals;
