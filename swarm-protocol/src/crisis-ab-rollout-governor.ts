import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_ab_rollout_governor',
    collectionField: 'rollouts',
    idField: 'rolloutId',
    defaultName: 'Crisis Rollout',
    readyPosture: 'crisis_ab_rollout_governed',
    defaultAgentId: 'agent:crisis-ab-rollout',
    recommendationTypes: {
        primary: 'govern_crisis_ab_rollout',
        guard: 'mitigate_crisis_rollout_regression_risk',
        audit: 'audit_crisis_ab_rollout_signals',
        publish: 'publish_crisis_ab_rollout_status'
    },
    recommendationTargetMap: {
        govern_crisis_ab_rollout: 'agent:crisis',
        mitigate_crisis_rollout_regression_risk: 'agent:release',
        audit_crisis_ab_rollout_signals: 'agent:trust',
        publish_crisis_ab_rollout_status: 'agent:ops'
    }
});

export function governCrisisAbRollouts(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisAbRolloutGovernorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisAbRolloutGovernor extends BaseManager {}

export const __crisisAbRolloutGovernorInternals = toolkit.internals;
