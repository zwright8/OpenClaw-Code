import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_signal_ingestion_normalizer',
    collectionField: 'signals',
    idField: 'signalId',
    defaultName: 'Education Signal',
    readyPosture: 'education_signal_normalized',
    defaultAgentId: 'agent:education-signal-normalizer',
    recommendationTypes: {
        primary: 'normalize_education_signal_ingestion',
        guard: 'mitigate_policy_drift_signal_noise',
        audit: 'audit_education_signal_normalization',
        publish: 'publish_education_signal_status'
    },
    recommendationTargetMap: {
        normalize_education_signal_ingestion: 'agent:education',
        mitigate_policy_drift_signal_noise: 'agent:compliance',
        audit_education_signal_normalization: 'agent:trust',
        publish_education_signal_status: 'agent:ops'
    }
});

export function normalizeEducationSignalIngestion(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationSignalIngestionNormalizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationSignalIngestionNormalizer extends BaseManager {}

export const __educationSignalIngestionNormalizerInternals = toolkit.internals;
