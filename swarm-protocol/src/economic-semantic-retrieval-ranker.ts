import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_semantic_retrieval_ranker',
    collectionField: 'retrievalSets',
    idField: 'retrievalId',
    defaultName: 'Economic Retrieval Set',
    readyPosture: 'economic_semantic_retrieval_ranked',
    defaultAgentId: 'agent:economic-semantic-retrieval',
    recommendationTypes: {
        primary: 'rank_economic_semantic_retrieval',
        guard: 'mitigate_economic_retrieval_precision_risk',
        audit: 'audit_economic_semantic_retrieval_signals',
        publish: 'publish_economic_semantic_retrieval_status'
    },
    recommendationTargetMap: {
        rank_economic_semantic_retrieval: 'agent:economic',
        mitigate_economic_retrieval_precision_risk: 'agent:policy',
        audit_economic_semantic_retrieval_signals: 'agent:trust',
        publish_economic_semantic_retrieval_status: 'agent:ops'
    }
});

export function rankEconomicSemanticRetrieval(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicSemanticRetrievalRankerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicSemanticRetrievalRanker extends BaseManager {}

export const __economicSemanticRetrievalRankerInternals = toolkit.internals;
