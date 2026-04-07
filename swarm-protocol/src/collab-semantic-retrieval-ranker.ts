import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_semantic_retrieval_ranker',
    collectionField: 'retrievalSets',
    idField: 'retrievalId',
    defaultName: 'Collab Retrieval Set',
    readyPosture: 'collab_semantic_retrieval_ranked',
    defaultAgentId: 'agent:collab-semantic-retrieval',
    recommendationTypes: {
        primary: 'rank_collab_semantic_retrieval',
        guard: 'mitigate_collab_retrieval_precision_risk',
        audit: 'audit_collab_semantic_retrieval_signals',
        publish: 'publish_collab_semantic_retrieval_status'
    },
    recommendationTargetMap: {
        rank_collab_semantic_retrieval: 'agent:collab',
        mitigate_collab_retrieval_precision_risk: 'agent:policy',
        audit_collab_semantic_retrieval_signals: 'agent:trust',
        publish_collab_semantic_retrieval_status: 'agent:ops'
    }
});

export function rankCollabSemanticRetrieval(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabSemanticRetrievalRankerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabSemanticRetrievalRanker extends BaseManager {}

export const __collabSemanticRetrievalRankerInternals = toolkit.internals;
