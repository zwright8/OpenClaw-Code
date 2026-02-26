import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_signal_ingestion_normalizer',
    collectionField: 'signals',
    idField: 'signalId',
    defaultName: 'Collab Signal',
    readyPosture: 'collab_signal_normalized',
    defaultAgentId: 'agent:collab-signal-normalizer',
    recommendationTypes: {
        primary: 'normalize_collab_signal_ingestion',
        guard: 'mitigate_collab_signal_noise',
        audit: 'audit_collab_signal_normalization',
        publish: 'publish_collab_signal_status'
    },
    recommendationTargetMap: {
        normalize_collab_signal_ingestion: 'agent:collab',
        mitigate_collab_signal_noise: 'agent:operations',
        audit_collab_signal_normalization: 'agent:trust',
        publish_collab_signal_status: 'agent:ops'
    }
});

export function normalizeCollabSignalIngestion(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabSignalIngestionNormalizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabSignalIngestionNormalizer extends BaseManager {}

export const __collabSignalIngestionNormalizerInternals = toolkit.internals;
