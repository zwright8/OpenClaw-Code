import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'tooling_auto_retry_backoff_coordinator',
    collectionField: 'retryPlans',
    idField: 'planId',
    defaultName: 'Retry Plan',
    readyPosture: 'retry_backoff_balanced',
    defaultAgentId: 'agent:tooling-retry-coordinator',
    recommendationTypes: {
        primary: 'coordinate_retry_backoff_policy',
        guard: 'mitigate_retry_storm_risk',
        audit: 'audit_retry_backoff_signals',
        publish: 'publish_retry_backoff_status'
    },
    recommendationTargetMap: {
        coordinate_retry_backoff_policy: 'agent:workflow',
        mitigate_retry_storm_risk: 'agent:reliability',
        audit_retry_backoff_signals: 'agent:trust',
        publish_retry_backoff_status: 'agent:ops'
    }
});

export function coordinateToolingAutoRetryBackoff(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function toolingAutoRetryBackoffToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ToolingAutoRetryBackoffCoordinator extends BaseManager {}

export const __toolingAutoRetryBackoffCoordinatorInternals = toolkit.internals;
