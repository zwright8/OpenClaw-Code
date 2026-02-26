import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_plan_quality_evaluator',
    collectionField: 'plans',
    idField: 'planId',
    defaultName: 'Community Plan',
    readyPosture: 'community_plan_quality_assured',
    defaultAgentId: 'agent:community-plan-quality',
    recommendationTypes: {
        primary: 'evaluate_community_plan_quality',
        guard: 'mitigate_community_plan_feasibility_risk',
        audit: 'audit_community_plan_quality_signals',
        publish: 'publish_community_plan_quality_status'
    },
    recommendationTargetMap: {
        evaluate_community_plan_quality: 'agent:community',
        mitigate_community_plan_feasibility_risk: 'agent:policy',
        audit_community_plan_quality_signals: 'agent:trust',
        publish_community_plan_quality_status: 'agent:ops'
    }
});

export function evaluateCommunityPlanQuality(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityPlanQualityEvaluatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityPlanQualityEvaluator extends BaseManager {}

export const __communityPlanQualityEvaluatorInternals = toolkit.internals;
