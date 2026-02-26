import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_semantic_retrieval_ranker',
    collectionField: 'retrievalSets',
    idField: 'retrievalId',
    defaultName: 'Infra Retrieval Set',
    readyPosture: 'infra_semantic_retrieval_ranked',
    defaultAgentId: 'agent:infra-semantic-retrieval',
    recommendationTypes: {
        primary: 'rank_infra_semantic_retrieval',
        guard: 'mitigate_infra_retrieval_precision_risk',
        audit: 'audit_infra_semantic_retrieval_signals',
        publish: 'publish_infra_semantic_retrieval_status'
    },
    recommendationTargetMap: {
        rank_infra_semantic_retrieval: 'agent:infra',
        mitigate_infra_retrieval_precision_risk: 'agent:policy',
        audit_infra_semantic_retrieval_signals: 'agent:trust',
        publish_infra_semantic_retrieval_status: 'agent:ops'
    }
});

export function rankInfraSemanticRetrieval(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraSemanticRetrievalRankerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraSemanticRetrievalRanker extends BaseManager {}

export const __infraSemanticRetrievalRankerInternals = toolkit.internals;
