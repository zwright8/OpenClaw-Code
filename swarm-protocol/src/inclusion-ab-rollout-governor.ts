import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_ab_rollout_governor',
    collectionField: 'rollouts',
    idField: 'rolloutId',
    defaultName: 'Inclusion Rollout',
    readyPosture: 'inclusion_ab_rollout_governed',
    defaultAgentId: 'agent:inclusion-rollout',
    recommendationTypes: {
        primary: 'govern_inclusion_ab_rollouts',
        guard: 'mitigate_inclusion_rollout_externalities',
        audit: 'audit_inclusion_rollout_signals',
        publish: 'publish_inclusion_rollout_status'
    },
    recommendationTargetMap: {
        govern_inclusion_ab_rollouts: 'agent:inclusion',
        mitigate_inclusion_rollout_externalities: 'agent:policy',
        audit_inclusion_rollout_signals: 'agent:trust',
        publish_inclusion_rollout_status: 'agent:ops'
    }
});

export function governInclusionAbRollouts(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionAbRolloutGovernorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionAbRolloutGovernor extends BaseManager {}

export const __inclusionAbRolloutGovernorInternals = toolkit.internals;
