import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_plan_quality_evaluator',
    collectionField: 'plans',
    idField: 'planId',
    defaultName: 'Collab Plan',
    readyPosture: 'collab_plan_quality_assured',
    defaultAgentId: 'agent:collab-plan-quality',
    recommendationTypes: {
        primary: 'evaluate_collab_plan_quality',
        guard: 'mitigate_collab_plan_feasibility_risk',
        audit: 'audit_collab_plan_quality_signals',
        publish: 'publish_collab_plan_quality_status'
    },
    recommendationTargetMap: {
        evaluate_collab_plan_quality: 'agent:collab',
        mitigate_collab_plan_feasibility_risk: 'agent:policy',
        audit_collab_plan_quality_signals: 'agent:trust',
        publish_collab_plan_quality_status: 'agent:ops'
    }
});

export function evaluateCollabPlanQuality(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabPlanQualityEvaluatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabPlanQualityEvaluator extends BaseManager {}

export const __collabPlanQualityEvaluatorInternals = toolkit.internals;
