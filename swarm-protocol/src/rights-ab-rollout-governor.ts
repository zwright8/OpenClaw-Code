import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_ab_rollout_governor',
    collectionField: 'rollouts',
    idField: 'rolloutId',
    defaultName: 'Rights Rollout',
    readyPosture: 'rights_ab_rollout_governed',
    defaultAgentId: 'agent:rights-rollout',
    recommendationTypes: {
        primary: 'govern_rights_ab_rollouts',
        guard: 'mitigate_rights_rollout_externalities',
        audit: 'audit_rights_rollout_signals',
        publish: 'publish_rights_rollout_status'
    },
    recommendationTargetMap: {
        govern_rights_ab_rollouts: 'agent:rights',
        mitigate_rights_rollout_externalities: 'agent:policy',
        audit_rights_rollout_signals: 'agent:trust',
        publish_rights_rollout_status: 'agent:ops'
    }
});

export function governRightsAbRollouts(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsAbRolloutGovernorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsAbRolloutGovernor extends BaseManager {}

export const __rightsAbRolloutGovernorInternals = toolkit.internals;
