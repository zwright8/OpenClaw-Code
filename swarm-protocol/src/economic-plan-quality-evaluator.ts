import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_plan_quality_evaluator',
    collectionField: 'plans',
    idField: 'planId',
    defaultName: 'Economic Plan',
    readyPosture: 'economic_plan_quality_assured',
    defaultAgentId: 'agent:economic-plan-quality',
    recommendationTypes: {
        primary: 'evaluate_economic_plan_quality',
        guard: 'mitigate_economic_plan_feasibility_risk',
        audit: 'audit_economic_plan_quality_signals',
        publish: 'publish_economic_plan_quality_status'
    },
    recommendationTargetMap: {
        evaluate_economic_plan_quality: 'agent:economic',
        mitigate_economic_plan_feasibility_risk: 'agent:policy',
        audit_economic_plan_quality_signals: 'agent:trust',
        publish_economic_plan_quality_status: 'agent:ops'
    }
});

export function evaluateEconomicPlanQuality(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicPlanQualityEvaluatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicPlanQualityEvaluator extends BaseManager {}

export const __economicPlanQualityEvaluatorInternals = toolkit.internals;
