import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_plan_quality_evaluator',
    collectionField: 'plans',
    idField: 'planId',
    defaultName: 'Rights Plan',
    readyPosture: 'rights_plan_quality_assured',
    defaultAgentId: 'agent:rights-plan-quality',
    recommendationTypes: {
        primary: 'evaluate_rights_plan_quality',
        guard: 'mitigate_rights_plan_feasibility_risk',
        audit: 'audit_rights_plan_quality_signals',
        publish: 'publish_rights_plan_quality_status'
    },
    recommendationTargetMap: {
        evaluate_rights_plan_quality: 'agent:rights',
        mitigate_rights_plan_feasibility_risk: 'agent:policy',
        audit_rights_plan_quality_signals: 'agent:trust',
        publish_rights_plan_quality_status: 'agent:ops'
    }
});

export function evaluateRightsPlanQuality(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsPlanQualityEvaluatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsPlanQualityEvaluator extends BaseManager {}

export const __rightsPlanQualityEvaluatorInternals = toolkit.internals;
