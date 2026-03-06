import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_auto_retry_backoff_coordinator',
    collectionField: 'retryPlans',
    idField: 'planId',
    defaultName: 'Impact Retry Plan',
    readyPosture: 'impact_retry_backoff_ready',
    defaultAgentId: 'agent:impact-retry-backoff',
    recommendationTypes: {
        primary: 'coordinate_impact_retry_backoff',
        guard: 'mitigate_impact_retry_storm',
        audit: 'audit_impact_retry_signals',
        publish: 'publish_impact_retry_status'
    },
    recommendationTargetMap: {
        coordinate_impact_retry_backoff: 'agent:impact',
        mitigate_impact_retry_storm: 'agent:reliability',
        audit_impact_retry_signals: 'agent:trust',
        publish_impact_retry_status: 'agent:ops'
    }
});

export function coordinateImpactAutoRetryBackoff(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactAutoRetryBackoffCoordinatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactAutoRetryBackoffCoordinator extends BaseManager {}

export const __impactAutoRetryBackoffCoordinatorInternals = toolkit.internals;
