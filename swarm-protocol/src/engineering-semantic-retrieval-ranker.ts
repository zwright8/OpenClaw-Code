import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_semantic_retrieval_ranker',
    collectionField: 'retrievalSets',
    idField: 'retrievalId',
    defaultName: 'Engineering Retrieval Set',
    readyPosture: 'engineering_semantic_retrieval_ranked',
    defaultAgentId: 'agent:engineering-semantic-retrieval',
    recommendationTypes: {
        primary: 'rank_engineering_semantic_retrieval',
        guard: 'mitigate_engineering_retrieval_precision_risk',
        audit: 'audit_engineering_semantic_retrieval_signals',
        publish: 'publish_engineering_semantic_retrieval_status'
    },
    recommendationTargetMap: {
        rank_engineering_semantic_retrieval: 'agent:engineering',
        mitigate_engineering_retrieval_precision_risk: 'agent:policy',
        audit_engineering_semantic_retrieval_signals: 'agent:trust',
        publish_engineering_semantic_retrieval_status: 'agent:ops'
    }
});

export function rankEngineeringSemanticRetrieval(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringSemanticRetrievalRankerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringSemanticRetrievalRanker extends BaseManager {}

export const __engineeringSemanticRetrievalRankerInternals = toolkit.internals;
