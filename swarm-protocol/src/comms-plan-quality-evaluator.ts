import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_plan_quality_evaluator',
    collectionField: 'plans',
    idField: 'planId',
    defaultName: 'Comms Plan',
    readyPosture: 'comms_plan_quality_assured',
    defaultAgentId: 'agent:comms-plan-quality',
    recommendationTypes: {
        primary: 'evaluate_comms_plan_quality',
        guard: 'mitigate_comms_plan_feasibility_risk',
        audit: 'audit_comms_plan_quality_signals',
        publish: 'publish_comms_plan_quality_status'
    },
    recommendationTargetMap: {
        evaluate_comms_plan_quality: 'agent:comms',
        mitigate_comms_plan_feasibility_risk: 'agent:policy',
        audit_comms_plan_quality_signals: 'agent:trust',
        publish_comms_plan_quality_status: 'agent:ops'
    }
});

export function evaluateCommsPlanQuality(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsPlanQualityEvaluatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsPlanQualityEvaluator extends BaseManager {}

export const __commsPlanQualityEvaluatorInternals = toolkit.internals;
