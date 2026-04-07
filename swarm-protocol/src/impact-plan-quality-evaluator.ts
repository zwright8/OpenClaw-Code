import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_plan_quality_evaluator',
    collectionField: 'plans',
    idField: 'planId',
    defaultName: 'Impact Plan',
    readyPosture: 'impact_plan_quality_assured',
    defaultAgentId: 'agent:impact-plan-quality',
    recommendationTypes: {
        primary: 'evaluate_impact_plan_quality',
        guard: 'mitigate_impact_plan_feasibility_risk',
        audit: 'audit_impact_plan_quality_signals',
        publish: 'publish_impact_plan_quality_status'
    },
    recommendationTargetMap: {
        evaluate_impact_plan_quality: 'agent:impact',
        mitigate_impact_plan_feasibility_risk: 'agent:policy',
        audit_impact_plan_quality_signals: 'agent:trust',
        publish_impact_plan_quality_status: 'agent:ops'
    }
});

export function evaluateImpactPlanQuality(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactPlanQualityEvaluatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactPlanQualityEvaluator extends BaseManager {}

export const __impactPlanQualityEvaluatorInternals = toolkit.internals;
