import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_semantic_retrieval_ranker',
    collectionField: 'retrievalSets',
    idField: 'retrievalId',
    defaultName: 'Education Retrieval Set',
    readyPosture: 'education_semantic_retrieval_ranked',
    defaultAgentId: 'agent:education-semantic-retrieval',
    recommendationTypes: {
        primary: 'rank_education_semantic_retrieval',
        guard: 'mitigate_education_retrieval_precision_risk',
        audit: 'audit_education_semantic_retrieval_signals',
        publish: 'publish_education_semantic_retrieval_status'
    },
    recommendationTargetMap: {
        rank_education_semantic_retrieval: 'agent:education',
        mitigate_education_retrieval_precision_risk: 'agent:policy',
        audit_education_semantic_retrieval_signals: 'agent:trust',
        publish_education_semantic_retrieval_status: 'agent:ops'
    }
});

export function rankEducationSemanticRetrieval(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationSemanticRetrievalRankerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationSemanticRetrievalRanker extends BaseManager {}

export const __educationSemanticRetrievalRankerInternals = toolkit.internals;
