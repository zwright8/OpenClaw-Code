import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_ab_rollout_governor',
    collectionField: 'rollouts',
    idField: 'rolloutId',
    defaultName: 'Security Rollout',
    readyPosture: 'security_ab_rollout_governed',
    defaultAgentId: 'agent:security-ab-rollout',
    recommendationTypes: {
        primary: 'govern_security_ab_rollout',
        guard: 'mitigate_security_rollout_regression_risk',
        audit: 'audit_security_ab_rollout_signals',
        publish: 'publish_security_ab_rollout_status'
    },
    recommendationTargetMap: {
        govern_security_ab_rollout: 'agent:security',
        mitigate_security_rollout_regression_risk: 'agent:release',
        audit_security_ab_rollout_signals: 'agent:trust',
        publish_security_ab_rollout_status: 'agent:ops'
    }
});

export function governSecurityAbRollouts(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityAbRolloutGovernorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityAbRolloutGovernor extends BaseManager {}

export const __securityAbRolloutGovernorInternals = toolkit.internals;
