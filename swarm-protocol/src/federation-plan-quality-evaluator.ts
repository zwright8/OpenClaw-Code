import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_plan_quality_evaluator',
    collectionField: 'plans',
    idField: 'planId',
    defaultName: 'Federation Plan',
    readyPosture: 'federation_plan_quality_assured',
    defaultAgentId: 'agent:federation-plan-quality',
    recommendationTypes: {
        primary: 'evaluate_federation_plan_quality',
        guard: 'mitigate_federation_plan_feasibility_risk',
        audit: 'audit_federation_plan_quality_signals',
        publish: 'publish_federation_plan_quality_status'
    },
    recommendationTargetMap: {
        evaluate_federation_plan_quality: 'agent:federation',
        mitigate_federation_plan_feasibility_risk: 'agent:policy',
        audit_federation_plan_quality_signals: 'agent:trust',
        publish_federation_plan_quality_status: 'agent:ops'
    }
});

export function evaluateFederationPlanQuality(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationPlanQualityEvaluatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationPlanQualityEvaluator extends BaseManager {}

export const __federationPlanQualityEvaluatorInternals = toolkit.internals;
