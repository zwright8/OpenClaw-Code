import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_auto_retry_backoff_coordinator',
    collectionField: 'retryPlans',
    idField: 'planId',
    defaultName: 'Community Retry Plan',
    readyPosture: 'community_retry_backoff_ready',
    defaultAgentId: 'agent:community-retry',
    recommendationTypes: {
        primary: 'coordinate_community_auto_retry_backoff',
        guard: 'mitigate_community_retry_storm_risk',
        audit: 'audit_community_retry_signals',
        publish: 'publish_community_retry_status'
    },
    recommendationTargetMap: {
        coordinate_community_auto_retry_backoff: 'agent:community',
        mitigate_community_retry_storm_risk: 'agent:reliability',
        audit_community_retry_signals: 'agent:trust',
        publish_community_retry_status: 'agent:ops'
    }
});

export function coordinateCommunityAutoRetryBackoff(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityAutoRetryBackoffCoordinatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityAutoRetryBackoffCoordinator extends BaseManager {}

export const __communityAutoRetryBackoffCoordinatorInternals = toolkit.internals;
