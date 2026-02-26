import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_signal_ingestion_normalizer',
    collectionField: 'signals',
    idField: 'signalId',
    defaultName: 'Oversight Signal',
    readyPosture: 'oversight_signal_normalized',
    defaultAgentId: 'agent:oversight-signal-normalizer',
    recommendationTypes: {
        primary: 'normalize_oversight_signal_ingestion',
        guard: 'mitigate_oversight_approval_signal_noise',
        audit: 'audit_oversight_signal_normalization',
        publish: 'publish_oversight_signal_status'
    },
    recommendationTargetMap: {
        normalize_oversight_signal_ingestion: 'agent:oversight',
        mitigate_oversight_approval_signal_noise: 'agent:operations',
        audit_oversight_signal_normalization: 'agent:trust',
        publish_oversight_signal_status: 'agent:ops'
    }
});

export function normalizeOversightSignalIngestion(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightSignalIngestionNormalizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightSignalIngestionNormalizer extends BaseManager {}

export const __oversightSignalIngestionNormalizerInternals = toolkit.internals;
