import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_ab_rollout_governor',
    collectionField: 'rollouts',
    idField: 'rolloutId',
    defaultName: 'Comms Rollout',
    readyPosture: 'comms_ab_rollout_governed',
    defaultAgentId: 'agent:comms-ab-rollout',
    recommendationTypes: {
        primary: 'govern_comms_ab_rollout',
        guard: 'mitigate_comms_rollout_regression_risk',
        audit: 'audit_comms_ab_rollout_signals',
        publish: 'publish_comms_ab_rollout_status'
    },
    recommendationTargetMap: {
        govern_comms_ab_rollout: 'agent:comms',
        mitigate_comms_rollout_regression_risk: 'agent:release',
        audit_comms_ab_rollout_signals: 'agent:trust',
        publish_comms_ab_rollout_status: 'agent:ops'
    }
});

export function governCommsAbRollouts(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsAbRolloutGovernorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsAbRolloutGovernor extends BaseManager {}

export const __commsAbRolloutGovernorInternals = toolkit.internals;
