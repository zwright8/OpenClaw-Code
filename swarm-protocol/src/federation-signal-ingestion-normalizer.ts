import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_signal_ingestion_normalizer',
    collectionField: 'signals',
    idField: 'signalId',
    defaultName: 'Federation Signal',
    readyPosture: 'federation_signal_normalized',
    defaultAgentId: 'agent:federation-signal-normalizer',
    recommendationTypes: {
        primary: 'normalize_federation_signal_ingestion',
        guard: 'mitigate_policy_drift_signal_noise',
        audit: 'audit_federation_signal_normalization',
        publish: 'publish_federation_signal_status'
    },
    recommendationTargetMap: {
        normalize_federation_signal_ingestion: 'agent:federation',
        mitigate_policy_drift_signal_noise: 'agent:compliance',
        audit_federation_signal_normalization: 'agent:trust',
        publish_federation_signal_status: 'agent:ops'
    }
});

export function normalizeFederationSignalIngestion(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationSignalIngestionNormalizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationSignalIngestionNormalizer extends BaseManager {}

export const __federationSignalIngestionNormalizerInternals = toolkit.internals;
