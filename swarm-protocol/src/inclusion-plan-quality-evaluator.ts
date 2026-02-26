import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_plan_quality_evaluator',
    collectionField: 'plans',
    idField: 'planId',
    defaultName: 'Inclusion Plan',
    readyPosture: 'inclusion_plan_quality_assured',
    defaultAgentId: 'agent:inclusion-plan-quality',
    recommendationTypes: {
        primary: 'evaluate_inclusion_plan_quality',
        guard: 'mitigate_inclusion_plan_feasibility_risk',
        audit: 'audit_inclusion_plan_quality_signals',
        publish: 'publish_inclusion_plan_quality_status'
    },
    recommendationTargetMap: {
        evaluate_inclusion_plan_quality: 'agent:inclusion',
        mitigate_inclusion_plan_feasibility_risk: 'agent:policy',
        audit_inclusion_plan_quality_signals: 'agent:trust',
        publish_inclusion_plan_quality_status: 'agent:ops'
    }
});

export function evaluateInclusionPlanQuality(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionPlanQualityEvaluatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionPlanQualityEvaluator extends BaseManager {}

export const __inclusionPlanQualityEvaluatorInternals = toolkit.internals;
