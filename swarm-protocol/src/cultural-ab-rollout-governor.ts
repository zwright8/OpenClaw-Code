import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_ab_rollout_governor',
    collectionField: 'rollouts',
    idField: 'rolloutId',
    defaultName: 'Cultural Rollout',
    readyPosture: 'cultural_ab_rollout_governed',
    defaultAgentId: 'agent:cultural-rollout',
    recommendationTypes: {
        primary: 'govern_cultural_ab_rollouts',
        guard: 'mitigate_cultural_rollout_externalities',
        audit: 'audit_cultural_rollout_signals',
        publish: 'publish_cultural_rollout_status'
    },
    recommendationTargetMap: {
        govern_cultural_ab_rollouts: 'agent:cultural',
        mitigate_cultural_rollout_externalities: 'agent:policy',
        audit_cultural_rollout_signals: 'agent:trust',
        publish_cultural_rollout_status: 'agent:ops'
    }
});

export function governCulturalAbRollouts(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalAbRolloutGovernorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalAbRolloutGovernor extends BaseManager {}

export const __culturalAbRolloutGovernorInternals = toolkit.internals;
