import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_plan_quality_evaluator',
    collectionField: 'plans',
    idField: 'planId',
    defaultName: 'Infra Plan',
    readyPosture: 'infra_plan_quality_assured',
    defaultAgentId: 'agent:infra-plan-quality',
    recommendationTypes: {
        primary: 'evaluate_infra_plan_quality',
        guard: 'mitigate_infra_plan_feasibility_risk',
        audit: 'audit_infra_plan_quality_signals',
        publish: 'publish_infra_plan_quality_status'
    },
    recommendationTargetMap: {
        evaluate_infra_plan_quality: 'agent:infra',
        mitigate_infra_plan_feasibility_risk: 'agent:policy',
        audit_infra_plan_quality_signals: 'agent:trust',
        publish_infra_plan_quality_status: 'agent:ops'
    }
});

export function evaluateInfraPlanQuality(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraPlanQualityEvaluatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraPlanQualityEvaluator extends BaseManager {}

export const __infraPlanQualityEvaluatorInternals = toolkit.internals;
