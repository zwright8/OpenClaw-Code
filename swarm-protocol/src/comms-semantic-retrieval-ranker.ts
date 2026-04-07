import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_semantic_retrieval_ranker',
    collectionField: 'retrievalSets',
    idField: 'retrievalId',
    defaultName: 'Comms Retrieval Set',
    readyPosture: 'comms_semantic_retrieval_ranked',
    defaultAgentId: 'agent:comms-semantic-retrieval',
    recommendationTypes: {
        primary: 'rank_comms_semantic_retrieval',
        guard: 'mitigate_comms_retrieval_precision_risk',
        audit: 'audit_comms_semantic_retrieval_signals',
        publish: 'publish_comms_semantic_retrieval_status'
    },
    recommendationTargetMap: {
        rank_comms_semantic_retrieval: 'agent:comms',
        mitigate_comms_retrieval_precision_risk: 'agent:policy',
        audit_comms_semantic_retrieval_signals: 'agent:trust',
        publish_comms_semantic_retrieval_status: 'agent:ops'
    }
});

export function rankCommsSemanticRetrieval(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsSemanticRetrievalRankerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsSemanticRetrievalRanker extends BaseManager {}

export const __commsSemanticRetrievalRankerInternals = toolkit.internals;
