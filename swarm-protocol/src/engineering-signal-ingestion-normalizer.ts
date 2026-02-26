import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_signal_ingestion_normalizer',
    collectionField: 'signals',
    idField: 'signalId',
    defaultName: 'Engineering Signal',
    readyPosture: 'engineering_signal_normalized',
    defaultAgentId: 'agent:engineering-signal-normalizer',
    recommendationTypes: {
        primary: 'normalize_engineering_signal_ingestion',
        guard: 'mitigate_policy_drift_signal_noise',
        audit: 'audit_engineering_signal_normalization',
        publish: 'publish_engineering_signal_status'
    },
    recommendationTargetMap: {
        normalize_engineering_signal_ingestion: 'agent:engineering',
        mitigate_policy_drift_signal_noise: 'agent:compliance',
        audit_engineering_signal_normalization: 'agent:trust',
        publish_engineering_signal_status: 'agent:ops'
    }
});

export function normalizeEngineeringSignalIngestion(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringSignalIngestionNormalizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringSignalIngestionNormalizer extends BaseManager {}

export const __engineeringSignalIngestionNormalizerInternals = toolkit.internals;
