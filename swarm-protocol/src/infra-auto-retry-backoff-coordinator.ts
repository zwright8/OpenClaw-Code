import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_auto_retry_backoff_coordinator',
    collectionField: 'retryPlans',
    idField: 'planId',
    defaultName: 'Infra Retry Plan',
    readyPosture: 'infra_retry_backoff_ready',
    defaultAgentId: 'agent:infra-retry',
    recommendationTypes: {
        primary: 'coordinate_infra_auto_retry_backoff',
        guard: 'mitigate_infra_retry_storm_risk',
        audit: 'audit_infra_retry_signals',
        publish: 'publish_infra_retry_status'
    },
    recommendationTargetMap: {
        coordinate_infra_auto_retry_backoff: 'agent:infra',
        mitigate_infra_retry_storm_risk: 'agent:reliability',
        audit_infra_retry_signals: 'agent:trust',
        publish_infra_retry_status: 'agent:ops'
    }
});

export function coordinateInfraAutoRetryBackoff(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraAutoRetryBackoffCoordinatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraAutoRetryBackoffCoordinator extends BaseManager {}

export const __infraAutoRetryBackoffCoordinatorInternals = toolkit.internals;
