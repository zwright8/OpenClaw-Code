import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_plan_quality_evaluator',
    collectionField: 'plans',
    idField: 'planId',
    defaultName: 'Observability Plan',
    readyPosture: 'observability_plan_quality_assured',
    defaultAgentId: 'agent:observability-plan-quality',
    recommendationTypes: {
        primary: 'evaluate_observability_plan_quality',
        guard: 'mitigate_observability_plan_feasibility_risk',
        audit: 'audit_observability_plan_quality_signals',
        publish: 'publish_observability_plan_quality_status'
    },
    recommendationTargetMap: {
        evaluate_observability_plan_quality: 'agent:observability',
        mitigate_observability_plan_feasibility_risk: 'agent:policy',
        audit_observability_plan_quality_signals: 'agent:trust',
        publish_observability_plan_quality_status: 'agent:ops'
    }
});

export function evaluateObservabilityPlanQuality(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityPlanQualityEvaluatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityPlanQualityEvaluator extends BaseManager {}

export const __observabilityPlanQualityEvaluatorInternals = toolkit.internals;
