import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_auto_retry_backoff_coordinator',
    collectionField: 'retryPlans',
    idField: 'planId',
    defaultName: 'Oversight Retry Plan',
    readyPosture: 'oversight_retry_backoff_ready',
    defaultAgentId: 'agent:oversight-retry-backoff',
    recommendationTypes: {
        primary: 'coordinate_oversight_retry_backoff',
        guard: 'mitigate_oversight_retry_storm',
        audit: 'audit_oversight_retry_signals',
        publish: 'publish_oversight_retry_status'
    },
    recommendationTargetMap: {
        coordinate_oversight_retry_backoff: 'agent:oversight',
        mitigate_oversight_retry_storm: 'agent:reliability',
        audit_oversight_retry_signals: 'agent:trust',
        publish_oversight_retry_status: 'agent:ops'
    }
});

export function coordinateOversightAutoRetryBackoff(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightAutoRetryBackoffCoordinatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightAutoRetryBackoffCoordinator extends BaseManager {}

export const __oversightAutoRetryBackoffCoordinatorInternals = toolkit.internals;
