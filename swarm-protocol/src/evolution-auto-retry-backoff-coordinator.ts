import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_auto_retry_backoff_coordinator',
    collectionField: 'retryPlans',
    idField: 'planId',
    defaultName: 'Evolution Retry Plan',
    readyPosture: 'evolution_retry_backoff_ready',
    defaultAgentId: 'agent:evolution-retry',
    recommendationTypes: {
        primary: 'coordinate_evolution_auto_retry_backoff',
        guard: 'mitigate_evolution_retry_storm_risk',
        audit: 'audit_evolution_retry_signals',
        publish: 'publish_evolution_retry_status'
    },
    recommendationTargetMap: {
        coordinate_evolution_auto_retry_backoff: 'agent:evolution',
        mitigate_evolution_retry_storm_risk: 'agent:reliability',
        audit_evolution_retry_signals: 'agent:trust',
        publish_evolution_retry_status: 'agent:ops'
    }
});

export function coordinateEvolutionAutoRetryBackoff(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionAutoRetryBackoffCoordinatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionAutoRetryBackoffCoordinator extends BaseManager {}

export const __evolutionAutoRetryBackoffCoordinatorInternals = toolkit.internals;
