import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_ab_rollout_governor',
    collectionField: 'rollouts',
    idField: 'rolloutId',
    defaultName: 'Community Rollout',
    readyPosture: 'community_ab_rollout_governed',
    defaultAgentId: 'agent:community-rollout',
    recommendationTypes: {
        primary: 'govern_community_ab_rollouts',
        guard: 'mitigate_community_rollout_externalities',
        audit: 'audit_community_rollout_signals',
        publish: 'publish_community_rollout_status'
    },
    recommendationTargetMap: {
        govern_community_ab_rollouts: 'agent:community',
        mitigate_community_rollout_externalities: 'agent:policy',
        audit_community_rollout_signals: 'agent:trust',
        publish_community_rollout_status: 'agent:ops'
    }
});

export function governCommunityAbRollouts(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityAbRolloutGovernorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityAbRolloutGovernor extends BaseManager {}

export const __communityAbRolloutGovernorInternals = toolkit.internals;
