import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_plan_quality_evaluator',
    collectionField: 'plans',
    idField: 'planId',
    defaultName: 'Security Plan',
    readyPosture: 'security_plan_quality_assured',
    defaultAgentId: 'agent:security-plan-quality',
    recommendationTypes: {
        primary: 'evaluate_security_plan_quality',
        guard: 'mitigate_security_plan_feasibility_risk',
        audit: 'audit_security_plan_quality_signals',
        publish: 'publish_security_plan_quality_status'
    },
    recommendationTargetMap: {
        evaluate_security_plan_quality: 'agent:security',
        mitigate_security_plan_feasibility_risk: 'agent:policy',
        audit_security_plan_quality_signals: 'agent:trust',
        publish_security_plan_quality_status: 'agent:ops'
    }
});

export function evaluateSecurityPlanQuality(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityPlanQualityEvaluatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityPlanQualityEvaluator extends BaseManager {}

export const __securityPlanQualityEvaluatorInternals = toolkit.internals;
