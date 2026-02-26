import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_signal_ingestion_normalizer',
    collectionField: 'signals',
    idField: 'signalId',
    defaultName: 'Research Signal',
    readyPosture: 'research_signal_normalized',
    defaultAgentId: 'agent:research-signal-normalizer',
    recommendationTypes: {
        primary: 'normalize_research_signal_ingestion',
        guard: 'mitigate_policy_drift_signal_noise',
        audit: 'audit_research_signal_normalization',
        publish: 'publish_research_signal_status'
    },
    recommendationTargetMap: {
        normalize_research_signal_ingestion: 'agent:research',
        mitigate_policy_drift_signal_noise: 'agent:compliance',
        audit_research_signal_normalization: 'agent:trust',
        publish_research_signal_status: 'agent:ops'
    }
});

export function normalizeResearchSignalIngestion(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchSignalIngestionNormalizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchSignalIngestionNormalizer extends BaseManager {}

export const __researchSignalIngestionNormalizerInternals = toolkit.internals;
