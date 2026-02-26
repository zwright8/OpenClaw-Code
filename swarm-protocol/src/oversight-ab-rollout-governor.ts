import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_ab_rollout_governor',
    collectionField: 'rollouts',
    idField: 'rolloutId',
    defaultName: 'Oversight Rollout',
    readyPosture: 'oversight_ab_rollout_governed',
    defaultAgentId: 'agent:oversight-ab-rollout',
    recommendationTypes: {
        primary: 'govern_oversight_ab_rollout',
        guard: 'mitigate_oversight_rollout_regression_risk',
        audit: 'audit_oversight_ab_rollout_signals',
        publish: 'publish_oversight_ab_rollout_status'
    },
    recommendationTargetMap: {
        govern_oversight_ab_rollout: 'agent:oversight',
        mitigate_oversight_rollout_regression_risk: 'agent:release',
        audit_oversight_ab_rollout_signals: 'agent:trust',
        publish_oversight_ab_rollout_status: 'agent:ops'
    }
});

export function governOversightAbRollouts(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightAbRolloutGovernorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightAbRolloutGovernor extends BaseManager {}

export const __oversightAbRolloutGovernorInternals = toolkit.internals;
