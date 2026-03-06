import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_semantic_retrieval_ranker',
    collectionField: 'retrievalSets',
    idField: 'retrievalId',
    defaultName: 'Federation Retrieval Set',
    readyPosture: 'federation_semantic_retrieval_ranked',
    defaultAgentId: 'agent:federation-semantic-retrieval',
    recommendationTypes: {
        primary: 'rank_federation_semantic_retrieval',
        guard: 'mitigate_federation_retrieval_precision_risk',
        audit: 'audit_federation_semantic_retrieval_signals',
        publish: 'publish_federation_semantic_retrieval_status'
    },
    recommendationTargetMap: {
        rank_federation_semantic_retrieval: 'agent:federation',
        mitigate_federation_retrieval_precision_risk: 'agent:policy',
        audit_federation_semantic_retrieval_signals: 'agent:trust',
        publish_federation_semantic_retrieval_status: 'agent:ops'
    }
});

export function rankFederationSemanticRetrieval(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationSemanticRetrievalRankerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationSemanticRetrievalRanker extends BaseManager {}

export const __federationSemanticRetrievalRankerInternals = toolkit.internals;
