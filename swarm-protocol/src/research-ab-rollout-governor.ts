import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_ab_rollout_governor',
    collectionField: 'rollouts',
    idField: 'rolloutId',
    defaultName: 'Research Rollout',
    readyPosture: 'research_ab_rollout_governed',
    defaultAgentId: 'agent:research-ab-rollout',
    recommendationTypes: {
        primary: 'govern_research_ab_rollout',
        guard: 'mitigate_research_rollout_regression_risk',
        audit: 'audit_research_ab_rollout_signals',
        publish: 'publish_research_ab_rollout_status'
    },
    recommendationTargetMap: {
        govern_research_ab_rollout: 'agent:research',
        mitigate_research_rollout_regression_risk: 'agent:release',
        audit_research_ab_rollout_signals: 'agent:trust',
        publish_research_ab_rollout_status: 'agent:ops'
    }
});

export function governResearchAbRollouts(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchAbRolloutGovernorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchAbRolloutGovernor extends BaseManager {}

export const __researchAbRolloutGovernorInternals = toolkit.internals;
