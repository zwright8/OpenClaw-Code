import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_auto_retry_backoff_coordinator',
    collectionField: 'retryPlans',
    idField: 'planId',
    defaultName: 'Federation Retry Plan',
    readyPosture: 'federation_retry_backoff_ready',
    defaultAgentId: 'agent:federation-retry-backoff',
    recommendationTypes: {
        primary: 'coordinate_federation_retry_backoff',
        guard: 'mitigate_federation_retry_storm',
        audit: 'audit_federation_retry_signals',
        publish: 'publish_federation_retry_status'
    },
    recommendationTargetMap: {
        coordinate_federation_retry_backoff: 'agent:federation',
        mitigate_federation_retry_storm: 'agent:reliability',
        audit_federation_retry_signals: 'agent:trust',
        publish_federation_retry_status: 'agent:ops'
    }
});

export function coordinateFederationAutoRetryBackoff(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationAutoRetryBackoffCoordinatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationAutoRetryBackoffCoordinator extends BaseManager {}

export const __federationAutoRetryBackoffCoordinatorInternals = toolkit.internals;
