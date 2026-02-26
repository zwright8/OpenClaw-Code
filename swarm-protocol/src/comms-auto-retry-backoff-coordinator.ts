import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_auto_retry_backoff_coordinator',
    collectionField: 'retryPlans',
    idField: 'planId',
    defaultName: 'Comms Retry Plan',
    readyPosture: 'comms_retry_backoff_ready',
    defaultAgentId: 'agent:comms-retry-backoff',
    recommendationTypes: {
        primary: 'coordinate_comms_retry_backoff',
        guard: 'mitigate_comms_retry_storm',
        audit: 'audit_comms_retry_signals',
        publish: 'publish_comms_retry_status'
    },
    recommendationTargetMap: {
        coordinate_comms_retry_backoff: 'agent:comms',
        mitigate_comms_retry_storm: 'agent:reliability',
        audit_comms_retry_signals: 'agent:trust',
        publish_comms_retry_status: 'agent:ops'
    }
});

export function coordinateCommsAutoRetryBackoff(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsAutoRetryBackoffCoordinatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsAutoRetryBackoffCoordinator extends BaseManager {}

export const __commsAutoRetryBackoffCoordinatorInternals = toolkit.internals;
