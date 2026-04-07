import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_semantic_retrieval_ranker',
    collectionField: 'retrievalSets',
    idField: 'retrievalId',
    defaultName: 'Crisis Retrieval Set',
    readyPosture: 'crisis_semantic_retrieval_ranked',
    defaultAgentId: 'agent:crisis-semantic-retrieval',
    recommendationTypes: {
        primary: 'rank_crisis_semantic_retrieval',
        guard: 'mitigate_crisis_retrieval_precision_risk',
        audit: 'audit_crisis_semantic_retrieval_signals',
        publish: 'publish_crisis_semantic_retrieval_status'
    },
    recommendationTargetMap: {
        rank_crisis_semantic_retrieval: 'agent:crisis',
        mitigate_crisis_retrieval_precision_risk: 'agent:policy',
        audit_crisis_semantic_retrieval_signals: 'agent:trust',
        publish_crisis_semantic_retrieval_status: 'agent:ops'
    }
});

export function rankCrisisSemanticRetrieval(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisSemanticRetrievalRankerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisSemanticRetrievalRanker extends BaseManager {}

export const __crisisSemanticRetrievalRankerInternals = toolkit.internals;
