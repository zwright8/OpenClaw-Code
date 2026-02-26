import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_auto_retry_backoff_coordinator',
    collectionField: 'retryPlans',
    idField: 'planId',
    defaultName: 'Economic Retry Plan',
    readyPosture: 'economic_retry_backoff_ready',
    defaultAgentId: 'agent:economic-retry-backoff',
    recommendationTypes: {
        primary: 'coordinate_economic_retry_backoff',
        guard: 'mitigate_economic_retry_storm',
        audit: 'audit_economic_retry_signals',
        publish: 'publish_economic_retry_status'
    },
    recommendationTargetMap: {
        coordinate_economic_retry_backoff: 'agent:economic',
        mitigate_economic_retry_storm: 'agent:reliability',
        audit_economic_retry_signals: 'agent:trust',
        publish_economic_retry_status: 'agent:ops'
    }
});

export function coordinateEconomicAutoRetryBackoff(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicAutoRetryBackoffCoordinatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicAutoRetryBackoffCoordinator extends BaseManager {}

export const __economicAutoRetryBackoffCoordinatorInternals = toolkit.internals;
