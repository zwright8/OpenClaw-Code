import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_auto_retry_backoff_coordinator',
    collectionField: 'retryPlans',
    idField: 'planId',
    defaultName: 'Governance Retry Plan',
    readyPosture: 'governance_retry_backoff_ready',
    defaultAgentId: 'agent:governance-retry-backoff',
    recommendationTypes: {
        primary: 'coordinate_governance_retry_backoff',
        guard: 'mitigate_governance_retry_storm',
        audit: 'audit_governance_retry_signals',
        publish: 'publish_governance_retry_status'
    },
    recommendationTargetMap: {
        coordinate_governance_retry_backoff: 'agent:governance',
        mitigate_governance_retry_storm: 'agent:reliability',
        audit_governance_retry_signals: 'agent:trust',
        publish_governance_retry_status: 'agent:ops'
    }
});

export function coordinateGovernanceAutoRetryBackoff(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceAutoRetryBackoffCoordinatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceAutoRetryBackoffCoordinator extends BaseManager {}

export const __governanceAutoRetryBackoffCoordinatorInternals = toolkit.internals;
