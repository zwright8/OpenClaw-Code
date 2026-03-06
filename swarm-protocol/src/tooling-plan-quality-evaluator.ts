import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'tooling_plan_quality_evaluator',
    collectionField: 'plans',
    idField: 'planId',
    defaultName: 'Plan',
    readyPosture: 'plan_quality_assured',
    defaultAgentId: 'agent:tooling-plan-quality',
    recommendationTypes: {
        primary: 'score_plan_quality',
        guard: 'mitigate_plan_feasibility_risk',
        audit: 'audit_plan_quality_signals',
        publish: 'publish_plan_quality_status'
    },
    recommendationTargetMap: {
        score_plan_quality: 'agent:planning',
        mitigate_plan_feasibility_risk: 'agent:governance',
        audit_plan_quality_signals: 'agent:trust',
        publish_plan_quality_status: 'agent:ops'
    }
});

export function evaluateToolingPlanQuality(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function toolingPlanQualityEvaluatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ToolingPlanQualityEvaluator extends BaseManager {}

export const __toolingPlanQualityEvaluatorInternals = toolkit.internals;
