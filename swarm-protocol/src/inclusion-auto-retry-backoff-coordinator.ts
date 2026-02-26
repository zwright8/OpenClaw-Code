import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_auto_retry_backoff_coordinator',
    collectionField: 'retryPlans',
    idField: 'planId',
    defaultName: 'Inclusion Retry Plan',
    readyPosture: 'inclusion_retry_backoff_ready',
    defaultAgentId: 'agent:inclusion-retry',
    recommendationTypes: {
        primary: 'coordinate_inclusion_auto_retry_backoff',
        guard: 'mitigate_inclusion_retry_storm_risk',
        audit: 'audit_inclusion_retry_signals',
        publish: 'publish_inclusion_retry_status'
    },
    recommendationTargetMap: {
        coordinate_inclusion_auto_retry_backoff: 'agent:inclusion',
        mitigate_inclusion_retry_storm_risk: 'agent:reliability',
        audit_inclusion_retry_signals: 'agent:trust',
        publish_inclusion_retry_status: 'agent:ops'
    }
});

export function coordinateInclusionAutoRetryBackoff(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionAutoRetryBackoffCoordinatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionAutoRetryBackoffCoordinator extends BaseManager {}

export const __inclusionAutoRetryBackoffCoordinatorInternals = toolkit.internals;
