import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'tooling_ab_rollout_governor',
    collectionField: 'rollouts',
    idField: 'rolloutId',
    defaultName: 'Rollout',
    readyPosture: 'ab_rollout_governed',
    defaultAgentId: 'agent:tooling-ab-rollout',
    recommendationTypes: {
        primary: 'govern_ab_rollout_stage',
        guard: 'mitigate_rollout_regression_risk',
        audit: 'audit_ab_rollout_signals',
        publish: 'publish_ab_rollout_status'
    },
    recommendationTargetMap: {
        govern_ab_rollout_stage: 'agent:release',
        mitigate_rollout_regression_risk: 'agent:reliability',
        audit_ab_rollout_signals: 'agent:trust',
        publish_ab_rollout_status: 'agent:ops'
    }
});

export function governToolingAbRollouts(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function toolingAbRolloutGovernorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ToolingAbRolloutGovernor extends BaseManager {}

export const __toolingAbRolloutGovernorInternals = toolkit.internals;
