import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_signal_ingestion_normalizer',
    collectionField: 'signals',
    idField: 'signalId',
    defaultName: 'Community Signal',
    readyPosture: 'community_signal_normalized',
    defaultAgentId: 'agent:community-signal-normalizer',
    recommendationTypes: {
        primary: 'normalize_community_signal_ingestion',
        guard: 'mitigate_community_signal_noise',
        audit: 'audit_community_signal_normalization',
        publish: 'publish_community_signal_status'
    },
    recommendationTargetMap: {
        normalize_community_signal_ingestion: 'agent:community',
        mitigate_community_signal_noise: 'agent:compliance',
        audit_community_signal_normalization: 'agent:trust',
        publish_community_signal_status: 'agent:ops'
    }
});

export function normalizeCommunitySignalIngestion(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communitySignalIngestionNormalizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunitySignalIngestionNormalizer extends BaseManager {}

export const __communitySignalIngestionNormalizerInternals = toolkit.internals;
