import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_semantic_retrieval_ranker',
    collectionField: 'retrievalSets',
    idField: 'retrievalId',
    defaultName: 'Oversight Retrieval Set',
    readyPosture: 'oversight_semantic_retrieval_ranked',
    defaultAgentId: 'agent:oversight-semantic-retrieval',
    recommendationTypes: {
        primary: 'rank_oversight_semantic_retrieval',
        guard: 'mitigate_oversight_retrieval_precision_risk',
        audit: 'audit_oversight_semantic_retrieval_signals',
        publish: 'publish_oversight_semantic_retrieval_status'
    },
    recommendationTargetMap: {
        rank_oversight_semantic_retrieval: 'agent:oversight',
        mitigate_oversight_retrieval_precision_risk: 'agent:policy',
        audit_oversight_semantic_retrieval_signals: 'agent:trust',
        publish_oversight_semantic_retrieval_status: 'agent:ops'
    }
});

export function rankOversightSemanticRetrieval(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightSemanticRetrievalRankerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightSemanticRetrievalRanker extends BaseManager {}

export const __oversightSemanticRetrievalRankerInternals = toolkit.internals;
