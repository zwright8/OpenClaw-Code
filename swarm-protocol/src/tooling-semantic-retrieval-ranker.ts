import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'tooling_semantic_retrieval_ranker',
    collectionField: 'retrievalSets',
    idField: 'retrievalId',
    defaultName: 'Retrieval Set',
    readyPosture: 'semantic_retrieval_ranked',
    defaultAgentId: 'agent:tooling-semantic-retrieval',
    recommendationTypes: {
        primary: 'rank_semantic_retrieval_candidates',
        guard: 'mitigate_retrieval_precision_risk',
        audit: 'audit_semantic_retrieval_signals',
        publish: 'publish_semantic_retrieval_status'
    },
    recommendationTargetMap: {
        rank_semantic_retrieval_candidates: 'agent:search',
        mitigate_retrieval_precision_risk: 'agent:quality',
        audit_semantic_retrieval_signals: 'agent:trust',
        publish_semantic_retrieval_status: 'agent:ops'
    }
});

export function rankToolingSemanticRetrieval(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function toolingSemanticRetrievalRankerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ToolingSemanticRetrievalRanker extends BaseManager {}

export const __toolingSemanticRetrievalRankerInternals = toolkit.internals;
