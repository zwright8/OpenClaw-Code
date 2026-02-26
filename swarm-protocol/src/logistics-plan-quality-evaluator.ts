import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_plan_quality_evaluator',
    collectionField: 'plans',
    idField: 'planId',
    defaultName: 'Logistics Plan',
    readyPosture: 'logistics_plan_quality_assured',
    defaultAgentId: 'agent:logistics-plan-quality',
    recommendationTypes: {
        primary: 'evaluate_logistics_plan_quality',
        guard: 'mitigate_logistics_plan_feasibility_risk',
        audit: 'audit_logistics_plan_quality_signals',
        publish: 'publish_logistics_plan_quality_status'
    },
    recommendationTargetMap: {
        evaluate_logistics_plan_quality: 'agent:logistics',
        mitigate_logistics_plan_feasibility_risk: 'agent:policy',
        audit_logistics_plan_quality_signals: 'agent:trust',
        publish_logistics_plan_quality_status: 'agent:ops'
    }
});

export function evaluateLogisticsPlanQuality(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsPlanQualityEvaluatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsPlanQualityEvaluator extends BaseManager {}

export const __logisticsPlanQualityEvaluatorInternals = toolkit.internals;
