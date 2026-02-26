import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_auto_retry_backoff_coordinator',
    collectionField: 'retryPlans',
    idField: 'planId',
    defaultName: 'Crisis Retry Plan',
    readyPosture: 'crisis_retry_backoff_ready',
    defaultAgentId: 'agent:crisis-retry-backoff',
    recommendationTypes: {
        primary: 'coordinate_crisis_retry_backoff',
        guard: 'mitigate_crisis_retry_storm',
        audit: 'audit_crisis_retry_signals',
        publish: 'publish_crisis_retry_status'
    },
    recommendationTargetMap: {
        coordinate_crisis_retry_backoff: 'agent:crisis',
        mitigate_crisis_retry_storm: 'agent:reliability',
        audit_crisis_retry_signals: 'agent:trust',
        publish_crisis_retry_status: 'agent:ops'
    }
});

export function coordinateCrisisAutoRetryBackoff(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisAutoRetryBackoffCoordinatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisAutoRetryBackoffCoordinator extends BaseManager {}

export const __crisisAutoRetryBackoffCoordinatorInternals = toolkit.internals;
