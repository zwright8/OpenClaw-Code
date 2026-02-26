import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_auto_retry_backoff_coordinator',
    collectionField: 'retryPlans',
    idField: 'planId',
    defaultName: 'Security Retry Plan',
    readyPosture: 'security_retry_backoff_ready',
    defaultAgentId: 'agent:security-retry-backoff',
    recommendationTypes: {
        primary: 'coordinate_security_retry_backoff',
        guard: 'mitigate_security_retry_storm',
        audit: 'audit_security_retry_signals',
        publish: 'publish_security_retry_status'
    },
    recommendationTargetMap: {
        coordinate_security_retry_backoff: 'agent:security',
        mitigate_security_retry_storm: 'agent:reliability',
        audit_security_retry_signals: 'agent:trust',
        publish_security_retry_status: 'agent:ops'
    }
});

export function coordinateSecurityAutoRetryBackoff(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityAutoRetryBackoffCoordinatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityAutoRetryBackoffCoordinator extends BaseManager {}

export const __securityAutoRetryBackoffCoordinatorInternals = toolkit.internals;
