import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_ab_rollout_governor',
    collectionField: 'rollouts',
    idField: 'rolloutId',
    defaultName: 'Logistics Rollout',
    readyPosture: 'logistics_ab_rollout_governed',
    defaultAgentId: 'agent:logistics-ab-rollout',
    recommendationTypes: {
        primary: 'govern_logistics_ab_rollout',
        guard: 'mitigate_logistics_rollout_regression_risk',
        audit: 'audit_logistics_ab_rollout_signals',
        publish: 'publish_logistics_ab_rollout_status'
    },
    recommendationTargetMap: {
        govern_logistics_ab_rollout: 'agent:logistics',
        mitigate_logistics_rollout_regression_risk: 'agent:release',
        audit_logistics_ab_rollout_signals: 'agent:trust',
        publish_logistics_ab_rollout_status: 'agent:ops'
    }
});

export function governLogisticsAbRollouts(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsAbRolloutGovernorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsAbRolloutGovernor extends BaseManager {}

export const __logisticsAbRolloutGovernorInternals = toolkit.internals;
