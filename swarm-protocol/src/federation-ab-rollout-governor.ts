import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_ab_rollout_governor',
    collectionField: 'rollouts',
    idField: 'rolloutId',
    defaultName: 'Federation Rollout',
    readyPosture: 'federation_ab_rollout_governed',
    defaultAgentId: 'agent:federation-ab-rollout',
    recommendationTypes: {
        primary: 'govern_federation_ab_rollout',
        guard: 'mitigate_federation_rollout_regression_risk',
        audit: 'audit_federation_ab_rollout_signals',
        publish: 'publish_federation_ab_rollout_status'
    },
    recommendationTargetMap: {
        govern_federation_ab_rollout: 'agent:federation',
        mitigate_federation_rollout_regression_risk: 'agent:release',
        audit_federation_ab_rollout_signals: 'agent:trust',
        publish_federation_ab_rollout_status: 'agent:ops'
    }
});

export function governFederationAbRollouts(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationAbRolloutGovernorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationAbRolloutGovernor extends BaseManager {}

export const __federationAbRolloutGovernorInternals = toolkit.internals;
