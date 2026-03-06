import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_auto_retry_backoff_coordinator',
    collectionField: 'retryPlans',
    idField: 'planId',
    defaultName: 'Engineering Retry Plan',
    readyPosture: 'engineering_retry_backoff_ready',
    defaultAgentId: 'agent:engineering-retry-backoff',
    recommendationTypes: {
        primary: 'coordinate_engineering_retry_backoff',
        guard: 'mitigate_engineering_retry_storm',
        audit: 'audit_engineering_retry_signals',
        publish: 'publish_engineering_retry_status'
    },
    recommendationTargetMap: {
        coordinate_engineering_retry_backoff: 'agent:engineering',
        mitigate_engineering_retry_storm: 'agent:reliability',
        audit_engineering_retry_signals: 'agent:trust',
        publish_engineering_retry_status: 'agent:ops'
    }
});

export function coordinateEngineeringAutoRetryBackoff(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringAutoRetryBackoffCoordinatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringAutoRetryBackoffCoordinator extends BaseManager {}

export const __engineeringAutoRetryBackoffCoordinatorInternals = toolkit.internals;
