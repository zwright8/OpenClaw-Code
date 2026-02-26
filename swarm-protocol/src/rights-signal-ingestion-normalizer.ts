import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_signal_ingestion_normalizer',
    collectionField: 'signals',
    idField: 'signalId',
    defaultName: 'Rights Signal',
    readyPosture: 'rights_signal_normalized',
    defaultAgentId: 'agent:rights-signal-normalizer',
    recommendationTypes: {
        primary: 'normalize_rights_signal_ingestion',
        guard: 'mitigate_rights_signal_noise',
        audit: 'audit_rights_signal_normalization',
        publish: 'publish_rights_signal_status'
    },
    recommendationTargetMap: {
        normalize_rights_signal_ingestion: 'agent:rights',
        mitigate_rights_signal_noise: 'agent:compliance',
        audit_rights_signal_normalization: 'agent:trust',
        publish_rights_signal_status: 'agent:ops'
    }
});

export function normalizeRightsSignalIngestion(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsSignalIngestionNormalizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsSignalIngestionNormalizer extends BaseManager {}

export const __rightsSignalIngestionNormalizerInternals = toolkit.internals;
