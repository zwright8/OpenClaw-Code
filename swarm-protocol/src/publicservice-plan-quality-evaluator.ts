import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_plan_quality_evaluator',
    collectionField: 'plans',
    idField: 'planId',
    defaultName: 'PublicService Plan',
    readyPosture: 'publicservice_plan_quality_assured',
    defaultAgentId: 'agent:publicservice-plan-quality',
    recommendationTypes: {
        primary: 'evaluate_publicservice_plan_quality',
        guard: 'mitigate_publicservice_plan_feasibility_risk',
        audit: 'audit_publicservice_plan_quality_signals',
        publish: 'publish_publicservice_plan_quality_status'
    },
    recommendationTargetMap: {
        evaluate_publicservice_plan_quality: 'agent:publicservice',
        mitigate_publicservice_plan_feasibility_risk: 'agent:policy',
        audit_publicservice_plan_quality_signals: 'agent:trust',
        publish_publicservice_plan_quality_status: 'agent:ops'
    }
});

export function evaluatePublicServicePlanQuality(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServicePlanQualityEvaluatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServicePlanQualityEvaluator extends BaseManager {}

export const __publicServicePlanQualityEvaluatorInternals = toolkit.internals;
