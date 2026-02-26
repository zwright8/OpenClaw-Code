import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_semantic_retrieval_ranker',
    collectionField: 'retrievalSets',
    idField: 'retrievalId',
    defaultName: 'Evolution Retrieval Set',
    readyPosture: 'evolution_semantic_retrieval_ranked',
    defaultAgentId: 'agent:evolution-semantic-retrieval',
    recommendationTypes: {
        primary: 'rank_evolution_semantic_retrieval',
        guard: 'mitigate_evolution_retrieval_precision_risk',
        audit: 'audit_evolution_semantic_retrieval_signals',
        publish: 'publish_evolution_semantic_retrieval_status'
    },
    recommendationTargetMap: {
        rank_evolution_semantic_retrieval: 'agent:evolution',
        mitigate_evolution_retrieval_precision_risk: 'agent:policy',
        audit_evolution_semantic_retrieval_signals: 'agent:trust',
        publish_evolution_semantic_retrieval_status: 'agent:ops'
    }
});

export function rankEvolutionSemanticRetrieval(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionSemanticRetrievalRankerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionSemanticRetrievalRanker extends BaseManager {}

export const __evolutionSemanticRetrievalRankerInternals = toolkit.internals;
