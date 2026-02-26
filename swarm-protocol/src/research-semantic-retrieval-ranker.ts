import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_semantic_retrieval_ranker',
    collectionField: 'retrievalSets',
    idField: 'retrievalId',
    defaultName: 'Research Retrieval Set',
    readyPosture: 'research_semantic_retrieval_ranked',
    defaultAgentId: 'agent:research-semantic-retrieval',
    recommendationTypes: {
        primary: 'rank_research_semantic_retrieval',
        guard: 'mitigate_research_retrieval_precision_risk',
        audit: 'audit_research_semantic_retrieval_signals',
        publish: 'publish_research_semantic_retrieval_status'
    },
    recommendationTargetMap: {
        rank_research_semantic_retrieval: 'agent:research',
        mitigate_research_retrieval_precision_risk: 'agent:policy',
        audit_research_semantic_retrieval_signals: 'agent:trust',
        publish_research_semantic_retrieval_status: 'agent:ops'
    }
});

export function rankResearchSemanticRetrieval(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchSemanticRetrievalRankerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchSemanticRetrievalRanker extends BaseManager {}

export const __researchSemanticRetrievalRankerInternals = toolkit.internals;
