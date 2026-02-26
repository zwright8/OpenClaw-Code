import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_signal_ingestion_normalizer',
    collectionField: 'signals',
    idField: 'signalId',
    defaultName: 'Cultural Signal',
    readyPosture: 'cultural_signal_normalized',
    defaultAgentId: 'agent:cultural-signal-normalizer',
    recommendationTypes: {
        primary: 'normalize_cultural_signal_ingestion',
        guard: 'mitigate_policy_drift_signal_noise',
        audit: 'audit_cultural_signal_normalization',
        publish: 'publish_cultural_signal_status'
    },
    recommendationTargetMap: {
        normalize_cultural_signal_ingestion: 'agent:cultural',
        mitigate_policy_drift_signal_noise: 'agent:compliance',
        audit_cultural_signal_normalization: 'agent:trust',
        publish_cultural_signal_status: 'agent:ops'
    }
});

export function normalizeCulturalSignalIngestion(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalSignalIngestionNormalizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalSignalIngestionNormalizer extends BaseManager {}

export const __culturalSignalIngestionNormalizerInternals = toolkit.internals;
