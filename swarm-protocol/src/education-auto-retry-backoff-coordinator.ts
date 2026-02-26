import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_auto_retry_backoff_coordinator',
    collectionField: 'retryPlans',
    idField: 'planId',
    defaultName: 'Education Retry Plan',
    readyPosture: 'education_retry_backoff_ready',
    defaultAgentId: 'agent:education-retry-backoff',
    recommendationTypes: {
        primary: 'coordinate_education_retry_backoff',
        guard: 'mitigate_education_retry_storm',
        audit: 'audit_education_retry_signals',
        publish: 'publish_education_retry_status'
    },
    recommendationTargetMap: {
        coordinate_education_retry_backoff: 'agent:education',
        mitigate_education_retry_storm: 'agent:reliability',
        audit_education_retry_signals: 'agent:trust',
        publish_education_retry_status: 'agent:ops'
    }
});

export function coordinateEducationAutoRetryBackoff(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationAutoRetryBackoffCoordinatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationAutoRetryBackoffCoordinator extends BaseManager {}

export const __educationAutoRetryBackoffCoordinatorInternals = toolkit.internals;
