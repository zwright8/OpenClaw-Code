import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_semantic_retrieval_ranker',
    collectionField: 'retrievalSets',
    idField: 'retrievalId',
    defaultName: 'Community Retrieval Set',
    readyPosture: 'community_semantic_retrieval_ranked',
    defaultAgentId: 'agent:community-semantic-retrieval',
    recommendationTypes: {
        primary: 'rank_community_semantic_retrieval',
        guard: 'mitigate_community_retrieval_precision_risk',
        audit: 'audit_community_semantic_retrieval_signals',
        publish: 'publish_community_semantic_retrieval_status'
    },
    recommendationTargetMap: {
        rank_community_semantic_retrieval: 'agent:community',
        mitigate_community_retrieval_precision_risk: 'agent:policy',
        audit_community_semantic_retrieval_signals: 'agent:trust',
        publish_community_semantic_retrieval_status: 'agent:ops'
    }
});

export function rankCommunitySemanticRetrieval(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communitySemanticRetrievalRankerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunitySemanticRetrievalRanker extends BaseManager {}

export const __communitySemanticRetrievalRankerInternals = toolkit.internals;
