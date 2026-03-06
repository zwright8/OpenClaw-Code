import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_auto_retry_backoff_coordinator',
    collectionField: 'retryPlans',
    idField: 'planId',
    defaultName: 'PublicService Retry Plan',
    readyPosture: 'publicservice_retry_backoff_ready',
    defaultAgentId: 'agent:publicservice-retry-backoff',
    recommendationTypes: {
        primary: 'coordinate_publicservice_retry_backoff',
        guard: 'mitigate_publicservice_retry_storm',
        audit: 'audit_publicservice_retry_signals',
        publish: 'publish_publicservice_retry_status'
    },
    recommendationTargetMap: {
        coordinate_publicservice_retry_backoff: 'agent:publicservice',
        mitigate_publicservice_retry_storm: 'agent:reliability',
        audit_publicservice_retry_signals: 'agent:trust',
        publish_publicservice_retry_status: 'agent:ops'
    }
});

export function coordinatePublicServiceAutoRetryBackoff(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceAutoRetryBackoffCoordinatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceAutoRetryBackoffCoordinator extends BaseManager {}

export const __publicServiceAutoRetryBackoffCoordinatorInternals = toolkit.internals;
