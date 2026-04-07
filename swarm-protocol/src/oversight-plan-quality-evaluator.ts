import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_plan_quality_evaluator',
    collectionField: 'plans',
    idField: 'planId',
    defaultName: 'Oversight Plan',
    readyPosture: 'oversight_plan_quality_assured',
    defaultAgentId: 'agent:oversight-plan-quality',
    recommendationTypes: {
        primary: 'evaluate_oversight_plan_quality',
        guard: 'mitigate_oversight_plan_feasibility_risk',
        audit: 'audit_oversight_plan_quality_signals',
        publish: 'publish_oversight_plan_quality_status'
    },
    recommendationTargetMap: {
        evaluate_oversight_plan_quality: 'agent:oversight',
        mitigate_oversight_plan_feasibility_risk: 'agent:policy',
        audit_oversight_plan_quality_signals: 'agent:trust',
        publish_oversight_plan_quality_status: 'agent:ops'
    }
});

export function evaluateOversightPlanQuality(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightPlanQualityEvaluatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightPlanQualityEvaluator extends BaseManager {}

export const __oversightPlanQualityEvaluatorInternals = toolkit.internals;
