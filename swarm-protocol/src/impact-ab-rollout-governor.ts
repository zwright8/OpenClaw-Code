import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_ab_rollout_governor',
    collectionField: 'rollouts',
    idField: 'rolloutId',
    defaultName: 'Impact Rollout',
    readyPosture: 'impact_ab_rollout_governed',
    defaultAgentId: 'agent:impact-ab-rollout',
    recommendationTypes: {
        primary: 'govern_impact_ab_rollout',
        guard: 'mitigate_impact_rollout_regression_risk',
        audit: 'audit_impact_ab_rollout_signals',
        publish: 'publish_impact_ab_rollout_status'
    },
    recommendationTargetMap: {
        govern_impact_ab_rollout: 'agent:impact',
        mitigate_impact_rollout_regression_risk: 'agent:release',
        audit_impact_ab_rollout_signals: 'agent:trust',
        publish_impact_ab_rollout_status: 'agent:ops'
    }
});

export function governImpactAbRollouts(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactAbRolloutGovernorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactAbRolloutGovernor extends BaseManager {}

export const __impactAbRolloutGovernorInternals = toolkit.internals;
