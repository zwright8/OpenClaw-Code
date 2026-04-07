import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_ab_rollout_governor',
    collectionField: 'rollouts',
    idField: 'rolloutId',
    defaultName: 'Engineering Rollout',
    readyPosture: 'engineering_ab_rollout_governed',
    defaultAgentId: 'agent:engineering-ab-rollout',
    recommendationTypes: {
        primary: 'govern_engineering_ab_rollout',
        guard: 'mitigate_engineering_rollout_regression_risk',
        audit: 'audit_engineering_ab_rollout_signals',
        publish: 'publish_engineering_ab_rollout_status'
    },
    recommendationTargetMap: {
        govern_engineering_ab_rollout: 'agent:engineering',
        mitigate_engineering_rollout_regression_risk: 'agent:release',
        audit_engineering_ab_rollout_signals: 'agent:trust',
        publish_engineering_ab_rollout_status: 'agent:ops'
    }
});

export function governEngineeringAbRollouts(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringAbRolloutGovernorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringAbRolloutGovernor extends BaseManager {}

export const __engineeringAbRolloutGovernorInternals = toolkit.internals;
