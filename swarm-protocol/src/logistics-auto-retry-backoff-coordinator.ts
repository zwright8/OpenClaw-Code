import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_auto_retry_backoff_coordinator',
    collectionField: 'retryPlans',
    idField: 'planId',
    defaultName: 'Logistics Retry Plan',
    readyPosture: 'logistics_retry_backoff_ready',
    defaultAgentId: 'agent:logistics-retry-backoff',
    recommendationTypes: {
        primary: 'coordinate_logistics_retry_backoff',
        guard: 'mitigate_logistics_retry_storm',
        audit: 'audit_logistics_retry_signals',
        publish: 'publish_logistics_retry_status'
    },
    recommendationTargetMap: {
        coordinate_logistics_retry_backoff: 'agent:logistics',
        mitigate_logistics_retry_storm: 'agent:reliability',
        audit_logistics_retry_signals: 'agent:trust',
        publish_logistics_retry_status: 'agent:ops'
    }
});

export function coordinateLogisticsAutoRetryBackoff(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsAutoRetryBackoffCoordinatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsAutoRetryBackoffCoordinator extends BaseManager {}

export const __logisticsAutoRetryBackoffCoordinatorInternals = toolkit.internals;
