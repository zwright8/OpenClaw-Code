import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_auto_retry_backoff_coordinator',
    collectionField: 'retryPlans',
    idField: 'planId',
    defaultName: 'Research Retry Plan',
    readyPosture: 'research_retry_backoff_ready',
    defaultAgentId: 'agent:research-retry-backoff',
    recommendationTypes: {
        primary: 'coordinate_research_retry_backoff',
        guard: 'mitigate_research_retry_storm',
        audit: 'audit_research_retry_signals',
        publish: 'publish_research_retry_status'
    },
    recommendationTargetMap: {
        coordinate_research_retry_backoff: 'agent:research',
        mitigate_research_retry_storm: 'agent:reliability',
        audit_research_retry_signals: 'agent:trust',
        publish_research_retry_status: 'agent:ops'
    }
});

export function coordinateResearchAutoRetryBackoff(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchAutoRetryBackoffCoordinatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchAutoRetryBackoffCoordinator extends BaseManager {}

export const __researchAutoRetryBackoffCoordinatorInternals = toolkit.internals;
