import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_plan_quality_evaluator',
    collectionField: 'plans',
    idField: 'planId',
    defaultName: 'Governance Plan',
    readyPosture: 'governance_plan_quality_assured',
    defaultAgentId: 'agent:governance-plan-quality',
    recommendationTypes: {
        primary: 'evaluate_governance_plan_quality',
        guard: 'mitigate_governance_plan_feasibility_risk',
        audit: 'audit_governance_plan_quality_signals',
        publish: 'publish_governance_plan_quality_status'
    },
    recommendationTargetMap: {
        evaluate_governance_plan_quality: 'agent:governance',
        mitigate_governance_plan_feasibility_risk: 'agent:policy',
        audit_governance_plan_quality_signals: 'agent:trust',
        publish_governance_plan_quality_status: 'agent:ops'
    }
});

export function evaluateGovernancePlanQuality(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governancePlanQualityEvaluatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernancePlanQualityEvaluator extends BaseManager {}

export const __governancePlanQualityEvaluatorInternals = toolkit.internals;
