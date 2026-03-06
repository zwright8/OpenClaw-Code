import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_signal_ingestion_normalizer',
    collectionField: 'signals',
    idField: 'signalId',
    defaultName: 'Impact Signal',
    readyPosture: 'impact_signal_normalized',
    defaultAgentId: 'agent:impact-signal-normalizer',
    recommendationTypes: {
        primary: 'normalize_impact_signal_ingestion',
        guard: 'mitigate_policy_drift_signal_noise',
        audit: 'audit_impact_signal_normalization',
        publish: 'publish_impact_signal_status'
    },
    recommendationTargetMap: {
        normalize_impact_signal_ingestion: 'agent:impact',
        mitigate_policy_drift_signal_noise: 'agent:compliance',
        audit_impact_signal_normalization: 'agent:trust',
        publish_impact_signal_status: 'agent:ops'
    }
});

export function normalizeImpactSignalIngestion(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactSignalIngestionNormalizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactSignalIngestionNormalizer extends BaseManager {}

export const __impactSignalIngestionNormalizerInternals = toolkit.internals;
