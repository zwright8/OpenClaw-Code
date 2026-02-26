import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_signal_ingestion_normalizer',
    collectionField: 'signals',
    idField: 'signalId',
    defaultName: 'Security Signal',
    readyPosture: 'security_signal_normalized',
    defaultAgentId: 'agent:security-signal-normalizer',
    recommendationTypes: {
        primary: 'normalize_security_signal_ingestion',
        guard: 'mitigate_policy_drift_signal_noise',
        audit: 'audit_security_signal_normalization',
        publish: 'publish_security_signal_status'
    },
    recommendationTargetMap: {
        normalize_security_signal_ingestion: 'agent:security',
        mitigate_policy_drift_signal_noise: 'agent:compliance',
        audit_security_signal_normalization: 'agent:trust',
        publish_security_signal_status: 'agent:ops'
    }
});

export function normalizeSecuritySignalIngestion(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securitySignalIngestionNormalizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecuritySignalIngestionNormalizer extends BaseManager {}

export const __securitySignalIngestionNormalizerInternals = toolkit.internals;
