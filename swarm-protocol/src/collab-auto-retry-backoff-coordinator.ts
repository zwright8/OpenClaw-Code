import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_auto_retry_backoff_coordinator',
    collectionField: 'retryPlans',
    idField: 'planId',
    defaultName: 'Collab Retry Plan',
    readyPosture: 'collab_retry_backoff_ready',
    defaultAgentId: 'agent:collab-retry-backoff',
    recommendationTypes: {
        primary: 'coordinate_collab_retry_backoff',
        guard: 'mitigate_collab_retry_storm',
        audit: 'audit_collab_retry_signals',
        publish: 'publish_collab_retry_status'
    },
    recommendationTargetMap: {
        coordinate_collab_retry_backoff: 'agent:collab',
        mitigate_collab_retry_storm: 'agent:reliability',
        audit_collab_retry_signals: 'agent:trust',
        publish_collab_retry_status: 'agent:ops'
    }
});

export function coordinateCollabAutoRetryBackoff(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabAutoRetryBackoffCoordinatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabAutoRetryBackoffCoordinator extends BaseManager {}

export const __collabAutoRetryBackoffCoordinatorInternals = toolkit.internals;
