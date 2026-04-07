import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_semantic_retrieval_ranker',
    collectionField: 'retrievalSets',
    idField: 'retrievalId',
    defaultName: 'PublicService Retrieval Set',
    readyPosture: 'publicservice_semantic_retrieval_ranked',
    defaultAgentId: 'agent:publicservice-semantic-retrieval',
    recommendationTypes: {
        primary: 'rank_publicservice_semantic_retrieval',
        guard: 'mitigate_publicservice_retrieval_precision_risk',
        audit: 'audit_publicservice_semantic_retrieval_signals',
        publish: 'publish_publicservice_semantic_retrieval_status'
    },
    recommendationTargetMap: {
        rank_publicservice_semantic_retrieval: 'agent:publicservice',
        mitigate_publicservice_retrieval_precision_risk: 'agent:policy',
        audit_publicservice_semantic_retrieval_signals: 'agent:trust',
        publish_publicservice_semantic_retrieval_status: 'agent:ops'
    }
});

export function rankPublicServiceSemanticRetrieval(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceSemanticRetrievalRankerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceSemanticRetrievalRanker extends BaseManager {}

export const __publicServiceSemanticRetrievalRankerInternals = toolkit.internals;
