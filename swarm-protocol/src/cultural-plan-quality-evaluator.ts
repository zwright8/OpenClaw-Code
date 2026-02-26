import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_plan_quality_evaluator',
    collectionField: 'plans',
    idField: 'planId',
    defaultName: 'Cultural Plan',
    readyPosture: 'cultural_plan_quality_assured',
    defaultAgentId: 'agent:cultural-plan-quality',
    recommendationTypes: {
        primary: 'evaluate_cultural_plan_quality',
        guard: 'mitigate_cultural_plan_feasibility_risk',
        audit: 'audit_cultural_plan_quality_signals',
        publish: 'publish_cultural_plan_quality_status'
    },
    recommendationTargetMap: {
        evaluate_cultural_plan_quality: 'agent:cultural',
        mitigate_cultural_plan_feasibility_risk: 'agent:policy',
        audit_cultural_plan_quality_signals: 'agent:trust',
        publish_cultural_plan_quality_status: 'agent:ops'
    }
});

export function evaluateCulturalPlanQuality(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalPlanQualityEvaluatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalPlanQualityEvaluator extends BaseManager {}

export const __culturalPlanQualityEvaluatorInternals = toolkit.internals;
