import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_signal_ingestion_normalizer',
    collectionField: 'signals',
    idField: 'signalId',
    defaultName: 'Crisis Signal',
    readyPosture: 'crisis_signal_normalized',
    defaultAgentId: 'agent:crisis-signal-normalizer',
    recommendationTypes: {
        primary: 'normalize_crisis_signal_ingestion',
        guard: 'mitigate_policy_drift_signal_noise',
        audit: 'audit_crisis_signal_normalization',
        publish: 'publish_crisis_signal_status'
    },
    recommendationTargetMap: {
        normalize_crisis_signal_ingestion: 'agent:crisis',
        mitigate_policy_drift_signal_noise: 'agent:compliance',
        audit_crisis_signal_normalization: 'agent:trust',
        publish_crisis_signal_status: 'agent:ops'
    }
});

export function normalizeCrisisSignalIngestion(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisSignalIngestionNormalizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisSignalIngestionNormalizer extends BaseManager {}

export const __crisisSignalIngestionNormalizerInternals = toolkit.internals;
