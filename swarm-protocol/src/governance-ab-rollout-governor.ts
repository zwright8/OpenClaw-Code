import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_ab_rollout_governor',
    collectionField: 'rollouts',
    idField: 'rolloutId',
    defaultName: 'Governance Rollout',
    readyPosture: 'governance_ab_rollout_governed',
    defaultAgentId: 'agent:governance-ab-rollout',
    recommendationTypes: {
        primary: 'govern_governance_ab_rollout',
        guard: 'mitigate_governance_rollout_regression_risk',
        audit: 'audit_governance_ab_rollout_signals',
        publish: 'publish_governance_ab_rollout_status'
    },
    recommendationTargetMap: {
        govern_governance_ab_rollout: 'agent:governance',
        mitigate_governance_rollout_regression_risk: 'agent:release',
        audit_governance_ab_rollout_signals: 'agent:trust',
        publish_governance_ab_rollout_status: 'agent:ops'
    }
});

export function governGovernanceAbRollouts(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceAbRolloutGovernorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceAbRolloutGovernor extends BaseManager {}

export const __governanceAbRolloutGovernorInternals = toolkit.internals;
