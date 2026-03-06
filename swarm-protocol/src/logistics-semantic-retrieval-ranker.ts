import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_semantic_retrieval_ranker',
    collectionField: 'retrievalSets',
    idField: 'retrievalId',
    defaultName: 'Logistics Retrieval Set',
    readyPosture: 'logistics_semantic_retrieval_ranked',
    defaultAgentId: 'agent:logistics-semantic-retrieval',
    recommendationTypes: {
        primary: 'rank_logistics_semantic_retrieval',
        guard: 'mitigate_logistics_retrieval_precision_risk',
        audit: 'audit_logistics_semantic_retrieval_signals',
        publish: 'publish_logistics_semantic_retrieval_status'
    },
    recommendationTargetMap: {
        rank_logistics_semantic_retrieval: 'agent:logistics',
        mitigate_logistics_retrieval_precision_risk: 'agent:policy',
        audit_logistics_semantic_retrieval_signals: 'agent:trust',
        publish_logistics_semantic_retrieval_status: 'agent:ops'
    }
});

export function rankLogisticsSemanticRetrieval(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsSemanticRetrievalRankerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsSemanticRetrievalRanker extends BaseManager {}

export const __logisticsSemanticRetrievalRankerInternals = toolkit.internals;
