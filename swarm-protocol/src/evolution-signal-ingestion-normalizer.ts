import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_signal_ingestion_normalizer',
    collectionField: 'signals',
    idField: 'signalId',
    defaultName: 'Evolution Signal',
    readyPosture: 'evolution_signal_normalized',
    defaultAgentId: 'agent:evolution-signal-normalizer',
    recommendationTypes: {
        primary: 'normalize_evolution_signal_ingestion',
        guard: 'mitigate_evolution_signal_noise',
        audit: 'audit_evolution_signal_normalization',
        publish: 'publish_evolution_signal_status'
    },
    recommendationTargetMap: {
        normalize_evolution_signal_ingestion: 'agent:evolution',
        mitigate_evolution_signal_noise: 'agent:learning',
        audit_evolution_signal_normalization: 'agent:trust',
        publish_evolution_signal_status: 'agent:ops'
    }
});

export function normalizeEvolutionSignalIngestion(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionSignalIngestionNormalizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionSignalIngestionNormalizer extends BaseManager {}

export const __evolutionSignalIngestionNormalizerInternals = toolkit.internals;
