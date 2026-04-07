import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_signal_ingestion_normalizer',
    collectionField: 'signals',
    idField: 'signalId',
    defaultName: 'Economic Signal',
    readyPosture: 'economic_signal_normalized',
    defaultAgentId: 'agent:economic-signal-normalizer',
    recommendationTypes: {
        primary: 'normalize_economic_signal_ingestion',
        guard: 'mitigate_policy_drift_signal_noise',
        audit: 'audit_economic_signal_normalization',
        publish: 'publish_economic_signal_status'
    },
    recommendationTargetMap: {
        normalize_economic_signal_ingestion: 'agent:economic',
        mitigate_policy_drift_signal_noise: 'agent:compliance',
        audit_economic_signal_normalization: 'agent:trust',
        publish_economic_signal_status: 'agent:ops'
    }
});

export function normalizeEconomicSignalIngestion(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicSignalIngestionNormalizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicSignalIngestionNormalizer extends BaseManager {}

export const __economicSignalIngestionNormalizerInternals = toolkit.internals;
