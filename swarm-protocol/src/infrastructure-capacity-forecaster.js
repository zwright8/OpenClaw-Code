import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infrastructure_capacity_forecaster',
    collectionField: 'systems',
    idField: 'systemId',
    defaultName: 'System',
    readyPosture: 'capacity_balanced',
    defaultAgentId: 'agent:infrastructure-capacity',
    recommendationTypes: {
        primary: 'expand_infrastructure_capacity',
        guard: 'mitigate_capacity_bottleneck',
        audit: 'validate_capacity_signals',
        publish: 'publish_capacity_forecast'
    },
    recommendationTargetMap: {
        expand_infrastructure_capacity: 'agent:infra',
        mitigate_capacity_bottleneck: 'agent:sre',
        validate_capacity_signals: 'agent:observability',
        publish_capacity_forecast: 'agent:ops'
    }
});

export function forecastInfrastructureCapacity(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infrastructureCapacityToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfrastructureCapacityForecaster extends BaseManager {}

export const __infrastructureCapacityForecasterInternals = toolkit.internals;
