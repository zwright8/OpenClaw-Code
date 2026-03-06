import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_semantic_retrieval_ranker',
    collectionField: 'retrievalSets',
    idField: 'retrievalId',
    defaultName: 'Governance Retrieval Set',
    readyPosture: 'governance_semantic_retrieval_ranked',
    defaultAgentId: 'agent:governance-semantic-retrieval',
    recommendationTypes: {
        primary: 'rank_governance_semantic_retrieval',
        guard: 'mitigate_governance_retrieval_precision_risk',
        audit: 'audit_governance_semantic_retrieval_signals',
        publish: 'publish_governance_semantic_retrieval_status'
    },
    recommendationTargetMap: {
        rank_governance_semantic_retrieval: 'agent:governance',
        mitigate_governance_retrieval_precision_risk: 'agent:policy',
        audit_governance_semantic_retrieval_signals: 'agent:trust',
        publish_governance_semantic_retrieval_status: 'agent:ops'
    }
});

export function rankGovernanceSemanticRetrieval(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceSemanticRetrievalRankerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceSemanticRetrievalRanker extends BaseManager {}

export const __governanceSemanticRetrievalRankerInternals = toolkit.internals;
