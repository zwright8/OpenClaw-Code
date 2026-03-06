import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_signal_ingestion_normalizer',
    collectionField: 'signals',
    idField: 'signalId',
    defaultName: 'Logistics Signal',
    readyPosture: 'logistics_signal_normalized',
    defaultAgentId: 'agent:logistics-signal-normalizer',
    recommendationTypes: {
        primary: 'normalize_logistics_signal_ingestion',
        guard: 'mitigate_policy_drift_signal_noise',
        audit: 'audit_logistics_signal_normalization',
        publish: 'publish_logistics_signal_status'
    },
    recommendationTargetMap: {
        normalize_logistics_signal_ingestion: 'agent:logistics',
        mitigate_policy_drift_signal_noise: 'agent:compliance',
        audit_logistics_signal_normalization: 'agent:trust',
        publish_logistics_signal_status: 'agent:ops'
    }
});

export function normalizeLogisticsSignalIngestion(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsSignalIngestionNormalizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsSignalIngestionNormalizer extends BaseManager {}

export const __logisticsSignalIngestionNormalizerInternals = toolkit.internals;
