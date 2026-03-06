import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_ab_rollout_governor',
    collectionField: 'rollouts',
    idField: 'rolloutId',
    defaultName: 'Collab Rollout',
    readyPosture: 'collab_ab_rollout_governed',
    defaultAgentId: 'agent:collab-ab-rollout',
    recommendationTypes: {
        primary: 'govern_collab_ab_rollout',
        guard: 'mitigate_collab_rollout_regression_risk',
        audit: 'audit_collab_ab_rollout_signals',
        publish: 'publish_collab_ab_rollout_status'
    },
    recommendationTargetMap: {
        govern_collab_ab_rollout: 'agent:collab',
        mitigate_collab_rollout_regression_risk: 'agent:release',
        audit_collab_ab_rollout_signals: 'agent:trust',
        publish_collab_ab_rollout_status: 'agent:ops'
    }
});

export function governCollabAbRollouts(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabAbRolloutGovernorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabAbRolloutGovernor extends BaseManager {}

export const __collabAbRolloutGovernorInternals = toolkit.internals;
