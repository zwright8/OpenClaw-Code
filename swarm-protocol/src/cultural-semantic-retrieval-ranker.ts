import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_semantic_retrieval_ranker',
    collectionField: 'retrievalSets',
    idField: 'retrievalId',
    defaultName: 'Cultural Retrieval Set',
    readyPosture: 'cultural_semantic_retrieval_ranked',
    defaultAgentId: 'agent:cultural-semantic-retrieval',
    recommendationTypes: {
        primary: 'rank_cultural_semantic_retrieval',
        guard: 'mitigate_cultural_retrieval_precision_risk',
        audit: 'audit_cultural_semantic_retrieval_signals',
        publish: 'publish_cultural_semantic_retrieval_status'
    },
    recommendationTargetMap: {
        rank_cultural_semantic_retrieval: 'agent:cultural',
        mitigate_cultural_retrieval_precision_risk: 'agent:policy',
        audit_cultural_semantic_retrieval_signals: 'agent:trust',
        publish_cultural_semantic_retrieval_status: 'agent:ops'
    }
});

export function rankCulturalSemanticRetrieval(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalSemanticRetrievalRankerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalSemanticRetrievalRanker extends BaseManager {}

export const __culturalSemanticRetrievalRankerInternals = toolkit.internals;
