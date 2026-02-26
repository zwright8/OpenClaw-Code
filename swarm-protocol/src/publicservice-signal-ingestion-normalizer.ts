import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_signal_ingestion_normalizer',
    collectionField: 'signals',
    idField: 'signalId',
    defaultName: 'PublicService Signal',
    readyPosture: 'publicservice_signal_ingestion_normalized',
    defaultAgentId: 'agent:publicservice-signal-ingestion',
    recommendationTypes: {
        primary: 'normalize_publicservice_signal_ingestion',
        guard: 'mitigate_publicservice_signal_drift',
        audit: 'audit_publicservice_signal_normalization',
        publish: 'publish_publicservice_signal_ingestion_status'
    },
    recommendationTargetMap: {
        normalize_publicservice_signal_ingestion: 'agent:publicservice',
        mitigate_publicservice_signal_drift: 'agent:platform',
        audit_publicservice_signal_normalization: 'agent:trust',
        publish_publicservice_signal_ingestion_status: 'agent:ops'
    }
});

export function normalizePublicServiceSignalIngestion(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceSignalIngestionNormalizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceSignalIngestionNormalizer extends BaseManager {}

export const __publicServiceSignalIngestionNormalizerInternals = toolkit.internals;
