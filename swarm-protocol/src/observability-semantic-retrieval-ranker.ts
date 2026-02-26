import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_semantic_retrieval_ranker',
    collectionField: 'retrievalSets',
    idField: 'retrievalId',
    defaultName: 'Observability Retrieval Set',
    readyPosture: 'observability_semantic_retrieval_ranked',
    defaultAgentId: 'agent:observability-semantic-retrieval',
    recommendationTypes: {
        primary: 'rank_observability_semantic_retrieval',
        guard: 'mitigate_observability_retrieval_precision_risk',
        audit: 'audit_observability_semantic_retrieval_signals',
        publish: 'publish_observability_semantic_retrieval_status'
    },
    recommendationTargetMap: {
        rank_observability_semantic_retrieval: 'agent:observability',
        mitigate_observability_retrieval_precision_risk: 'agent:policy',
        audit_observability_semantic_retrieval_signals: 'agent:trust',
        publish_observability_semantic_retrieval_status: 'agent:ops'
    }
});

export function rankObservabilitySemanticRetrieval(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilitySemanticRetrievalRankerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilitySemanticRetrievalRanker extends BaseManager {}

export const __observabilitySemanticRetrievalRankerInternals = toolkit.internals;
