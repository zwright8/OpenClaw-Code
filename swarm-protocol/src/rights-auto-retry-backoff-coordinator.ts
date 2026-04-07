import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_auto_retry_backoff_coordinator',
    collectionField: 'retryPlans',
    idField: 'planId',
    defaultName: 'Rights Retry Plan',
    readyPosture: 'rights_retry_backoff_ready',
    defaultAgentId: 'agent:rights-retry',
    recommendationTypes: {
        primary: 'coordinate_rights_auto_retry_backoff',
        guard: 'mitigate_rights_retry_storm_risk',
        audit: 'audit_rights_retry_signals',
        publish: 'publish_rights_retry_status'
    },
    recommendationTargetMap: {
        coordinate_rights_auto_retry_backoff: 'agent:rights',
        mitigate_rights_retry_storm_risk: 'agent:reliability',
        audit_rights_retry_signals: 'agent:trust',
        publish_rights_retry_status: 'agent:ops'
    }
});

export function coordinateRightsAutoRetryBackoff(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsAutoRetryBackoffCoordinatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsAutoRetryBackoffCoordinator extends BaseManager {}

export const __rightsAutoRetryBackoffCoordinatorInternals = toolkit.internals;
