import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_semantic_retrieval_ranker',
    collectionField: 'retrievalSets',
    idField: 'retrievalId',
    defaultName: 'Impact Retrieval Set',
    readyPosture: 'impact_semantic_retrieval_ranked',
    defaultAgentId: 'agent:impact-semantic-retrieval',
    recommendationTypes: {
        primary: 'rank_impact_semantic_retrieval',
        guard: 'mitigate_impact_retrieval_precision_risk',
        audit: 'audit_impact_semantic_retrieval_signals',
        publish: 'publish_impact_semantic_retrieval_status'
    },
    recommendationTargetMap: {
        rank_impact_semantic_retrieval: 'agent:impact',
        mitigate_impact_retrieval_precision_risk: 'agent:policy',
        audit_impact_semantic_retrieval_signals: 'agent:trust',
        publish_impact_semantic_retrieval_status: 'agent:ops'
    }
});

export function rankImpactSemanticRetrieval(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactSemanticRetrievalRankerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactSemanticRetrievalRanker extends BaseManager {}

export const __impactSemanticRetrievalRankerInternals = toolkit.internals;
