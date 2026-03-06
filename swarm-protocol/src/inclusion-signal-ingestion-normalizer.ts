import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_signal_ingestion_normalizer',
    collectionField: 'signals',
    idField: 'signalId',
    defaultName: 'Inclusion Signal',
    readyPosture: 'inclusion_signal_normalized',
    defaultAgentId: 'agent:inclusion-signal-normalizer',
    recommendationTypes: {
        primary: 'normalize_inclusion_signal_ingestion',
        guard: 'mitigate_inclusion_signal_noise',
        audit: 'audit_inclusion_signal_normalization',
        publish: 'publish_inclusion_signal_status'
    },
    recommendationTargetMap: {
        normalize_inclusion_signal_ingestion: 'agent:inclusion',
        mitigate_inclusion_signal_noise: 'agent:compliance',
        audit_inclusion_signal_normalization: 'agent:trust',
        publish_inclusion_signal_status: 'agent:ops'
    }
});

export function normalizeInclusionSignalIngestion(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionSignalIngestionNormalizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionSignalIngestionNormalizer extends BaseManager {}

export const __inclusionSignalIngestionNormalizerInternals = toolkit.internals;
