import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_semantic_retrieval_ranker',
    collectionField: 'retrievalSets',
    idField: 'retrievalId',
    defaultName: 'Rights Retrieval Set',
    readyPosture: 'rights_semantic_retrieval_ranked',
    defaultAgentId: 'agent:rights-semantic-retrieval',
    recommendationTypes: {
        primary: 'rank_rights_semantic_retrieval',
        guard: 'mitigate_rights_retrieval_precision_risk',
        audit: 'audit_rights_semantic_retrieval_signals',
        publish: 'publish_rights_semantic_retrieval_status'
    },
    recommendationTargetMap: {
        rank_rights_semantic_retrieval: 'agent:rights',
        mitigate_rights_retrieval_precision_risk: 'agent:policy',
        audit_rights_semantic_retrieval_signals: 'agent:trust',
        publish_rights_semantic_retrieval_status: 'agent:ops'
    }
});

export function rankRightsSemanticRetrieval(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsSemanticRetrievalRankerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsSemanticRetrievalRanker extends BaseManager {}

export const __rightsSemanticRetrievalRankerInternals = toolkit.internals;
