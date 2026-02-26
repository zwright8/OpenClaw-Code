import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_semantic_retrieval_ranker',
    collectionField: 'retrievalSets',
    idField: 'retrievalId',
    defaultName: 'Inclusion Retrieval Set',
    readyPosture: 'inclusion_semantic_retrieval_ranked',
    defaultAgentId: 'agent:inclusion-semantic-retrieval',
    recommendationTypes: {
        primary: 'rank_inclusion_semantic_retrieval',
        guard: 'mitigate_inclusion_retrieval_precision_risk',
        audit: 'audit_inclusion_semantic_retrieval_signals',
        publish: 'publish_inclusion_semantic_retrieval_status'
    },
    recommendationTargetMap: {
        rank_inclusion_semantic_retrieval: 'agent:inclusion',
        mitigate_inclusion_retrieval_precision_risk: 'agent:policy',
        audit_inclusion_semantic_retrieval_signals: 'agent:trust',
        publish_inclusion_semantic_retrieval_status: 'agent:ops'
    }
});

export function rankInclusionSemanticRetrieval(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionSemanticRetrievalRankerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionSemanticRetrievalRanker extends BaseManager {}

export const __inclusionSemanticRetrievalRankerInternals = toolkit.internals;
