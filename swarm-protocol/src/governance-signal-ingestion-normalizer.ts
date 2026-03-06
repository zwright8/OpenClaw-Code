import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_signal_ingestion_normalizer',
    collectionField: 'signals',
    idField: 'signalId',
    defaultName: 'Governance Signal',
    readyPosture: 'governance_signal_normalized',
    defaultAgentId: 'agent:governance-signal-normalizer',
    recommendationTypes: {
        primary: 'normalize_governance_signal_ingestion',
        guard: 'mitigate_policy_drift_signal_noise',
        audit: 'audit_governance_signal_normalization',
        publish: 'publish_governance_signal_status'
    },
    recommendationTargetMap: {
        normalize_governance_signal_ingestion: 'agent:governance',
        mitigate_policy_drift_signal_noise: 'agent:compliance',
        audit_governance_signal_normalization: 'agent:trust',
        publish_governance_signal_status: 'agent:ops'
    }
});

export function normalizeGovernanceSignalIngestion(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceSignalIngestionNormalizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceSignalIngestionNormalizer extends BaseManager {}

export const __governanceSignalIngestionNormalizerInternals = toolkit.internals;
