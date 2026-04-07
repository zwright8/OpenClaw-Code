import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_ab_rollout_governor',
    collectionField: 'rollouts',
    idField: 'rolloutId',
    defaultName: 'Infra Rollout',
    readyPosture: 'infra_ab_rollout_governed',
    defaultAgentId: 'agent:infra-rollout',
    recommendationTypes: {
        primary: 'govern_infra_ab_rollouts',
        guard: 'mitigate_infra_rollout_externalities',
        audit: 'audit_infra_rollout_signals',
        publish: 'publish_infra_rollout_status'
    },
    recommendationTargetMap: {
        govern_infra_ab_rollouts: 'agent:infra',
        mitigate_infra_rollout_externalities: 'agent:policy',
        audit_infra_rollout_signals: 'agent:trust',
        publish_infra_rollout_status: 'agent:ops'
    }
});

export function governInfraAbRollouts(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraAbRolloutGovernorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraAbRolloutGovernor extends BaseManager {}

export const __infraAbRolloutGovernorInternals = toolkit.internals;
