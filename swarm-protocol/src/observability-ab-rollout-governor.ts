import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_ab_rollout_governor',
    collectionField: 'rollouts',
    idField: 'rolloutId',
    defaultName: 'Observability Rollout',
    readyPosture: 'observability_ab_rollout_governed',
    defaultAgentId: 'agent:observability-ab-rollout',
    recommendationTypes: {
        primary: 'govern_observability_ab_rollout',
        guard: 'mitigate_observability_rollout_regression_risk',
        audit: 'audit_observability_ab_rollout_signals',
        publish: 'publish_observability_ab_rollout_status'
    },
    recommendationTargetMap: {
        govern_observability_ab_rollout: 'agent:observability',
        mitigate_observability_rollout_regression_risk: 'agent:release',
        audit_observability_ab_rollout_signals: 'agent:trust',
        publish_observability_ab_rollout_status: 'agent:ops'
    }
});

export function governObservabilityAbRollouts(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityAbRolloutGovernorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityAbRolloutGovernor extends BaseManager {}

export const __observabilityAbRolloutGovernorInternals = toolkit.internals;
