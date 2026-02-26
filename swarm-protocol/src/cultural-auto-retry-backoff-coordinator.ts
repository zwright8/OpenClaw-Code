import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_auto_retry_backoff_coordinator',
    collectionField: 'retryPlans',
    idField: 'planId',
    defaultName: 'Cultural Retry Plan',
    readyPosture: 'cultural_retry_backoff_ready',
    defaultAgentId: 'agent:cultural-retry',
    recommendationTypes: {
        primary: 'coordinate_cultural_auto_retry_backoff',
        guard: 'mitigate_cultural_retry_storm_risk',
        audit: 'audit_cultural_retry_signals',
        publish: 'publish_cultural_retry_status'
    },
    recommendationTargetMap: {
        coordinate_cultural_auto_retry_backoff: 'agent:cultural',
        mitigate_cultural_retry_storm_risk: 'agent:reliability',
        audit_cultural_retry_signals: 'agent:trust',
        publish_cultural_retry_status: 'agent:ops'
    }
});

export function coordinateCulturalAutoRetryBackoff(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalAutoRetryBackoffCoordinatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalAutoRetryBackoffCoordinator extends BaseManager {}

export const __culturalAutoRetryBackoffCoordinatorInternals = toolkit.internals;
