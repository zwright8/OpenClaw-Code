import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_ab_rollout_governor',
    collectionField: 'rollouts',
    idField: 'rolloutId',
    defaultName: 'Economic Rollout',
    readyPosture: 'economic_ab_rollout_governed',
    defaultAgentId: 'agent:economic-ab-rollout',
    recommendationTypes: {
        primary: 'govern_economic_ab_rollout',
        guard: 'mitigate_economic_rollout_regression_risk',
        audit: 'audit_economic_ab_rollout_signals',
        publish: 'publish_economic_ab_rollout_status'
    },
    recommendationTargetMap: {
        govern_economic_ab_rollout: 'agent:economic',
        mitigate_economic_rollout_regression_risk: 'agent:release',
        audit_economic_ab_rollout_signals: 'agent:trust',
        publish_economic_ab_rollout_status: 'agent:ops'
    }
});

export function governEconomicAbRollouts(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicAbRolloutGovernorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicAbRolloutGovernor extends BaseManager {}

export const __economicAbRolloutGovernorInternals = toolkit.internals;
