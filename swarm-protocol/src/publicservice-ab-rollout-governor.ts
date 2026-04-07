import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_ab_rollout_governor',
    collectionField: 'rollouts',
    idField: 'rolloutId',
    defaultName: 'PublicService Rollout',
    readyPosture: 'publicservice_ab_rollout_governed',
    defaultAgentId: 'agent:publicservice-ab-rollout',
    recommendationTypes: {
        primary: 'govern_publicservice_ab_rollout',
        guard: 'mitigate_publicservice_rollout_regression_risk',
        audit: 'audit_publicservice_ab_rollout_signals',
        publish: 'publish_publicservice_ab_rollout_status'
    },
    recommendationTargetMap: {
        govern_publicservice_ab_rollout: 'agent:publicservice',
        mitigate_publicservice_rollout_regression_risk: 'agent:release',
        audit_publicservice_ab_rollout_signals: 'agent:trust',
        publish_publicservice_ab_rollout_status: 'agent:ops'
    }
});

export function governPublicServiceAbRollouts(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceAbRolloutGovernorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceAbRolloutGovernor extends BaseManager {}

export const __publicServiceAbRolloutGovernorInternals = toolkit.internals;
