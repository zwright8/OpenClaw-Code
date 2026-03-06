import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_signal_ingestion_normalizer',
    collectionField: 'signals',
    idField: 'signalId',
    defaultName: 'Comms Signal',
    readyPosture: 'comms_signal_normalized',
    defaultAgentId: 'agent:comms-signal-normalizer',
    recommendationTypes: {
        primary: 'normalize_comms_signal_ingestion',
        guard: 'mitigate_policy_drift_signal_noise',
        audit: 'audit_comms_signal_normalization',
        publish: 'publish_comms_signal_status'
    },
    recommendationTargetMap: {
        normalize_comms_signal_ingestion: 'agent:comms',
        mitigate_policy_drift_signal_noise: 'agent:compliance',
        audit_comms_signal_normalization: 'agent:trust',
        publish_comms_signal_status: 'agent:ops'
    }
});

export function normalizeCommsSignalIngestion(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsSignalIngestionNormalizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsSignalIngestionNormalizer extends BaseManager {}

export const __commsSignalIngestionNormalizerInternals = toolkit.internals;
