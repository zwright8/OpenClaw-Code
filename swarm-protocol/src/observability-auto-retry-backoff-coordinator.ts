import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_auto_retry_backoff_coordinator',
    collectionField: 'retryPlans',
    idField: 'planId',
    defaultName: 'Observability Retry Plan',
    readyPosture: 'observability_retry_backoff_ready',
    defaultAgentId: 'agent:observability-retry-backoff',
    recommendationTypes: {
        primary: 'coordinate_observability_retry_backoff',
        guard: 'mitigate_observability_retry_storm',
        audit: 'audit_observability_retry_signals',
        publish: 'publish_observability_retry_status'
    },
    recommendationTargetMap: {
        coordinate_observability_retry_backoff: 'agent:observability',
        mitigate_observability_retry_storm: 'agent:reliability',
        audit_observability_retry_signals: 'agent:trust',
        publish_observability_retry_status: 'agent:ops'
    }
});

export function coordinateObservabilityAutoRetryBackoff(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityAutoRetryBackoffCoordinatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityAutoRetryBackoffCoordinator extends BaseManager {}

export const __observabilityAutoRetryBackoffCoordinatorInternals = toolkit.internals;
