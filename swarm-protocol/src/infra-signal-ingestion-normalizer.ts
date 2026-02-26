import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_signal_ingestion_normalizer',
    collectionField: 'signals',
    idField: 'signalId',
    defaultName: 'Infra Signal',
    readyPosture: 'infra_signal_normalized',
    defaultAgentId: 'agent:infra-signal-normalizer',
    recommendationTypes: {
        primary: 'normalize_infra_signal_ingestion',
        guard: 'mitigate_infra_signal_noise',
        audit: 'audit_infra_signal_normalization',
        publish: 'publish_infra_signal_status'
    },
    recommendationTargetMap: {
        normalize_infra_signal_ingestion: 'agent:infra',
        mitigate_infra_signal_noise: 'agent:sustainability',
        audit_infra_signal_normalization: 'agent:trust',
        publish_infra_signal_status: 'agent:ops'
    }
});

export function normalizeInfraSignalIngestion(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraSignalIngestionNormalizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraSignalIngestionNormalizer extends BaseManager {}

export const __infraSignalIngestionNormalizerInternals = toolkit.internals;
