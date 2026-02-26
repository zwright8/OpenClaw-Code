import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_semantic_retrieval_ranker',
    collectionField: 'retrievalSets',
    idField: 'retrievalId',
    defaultName: 'Security Retrieval Set',
    readyPosture: 'security_semantic_retrieval_ranked',
    defaultAgentId: 'agent:security-semantic-retrieval',
    recommendationTypes: {
        primary: 'rank_security_semantic_retrieval',
        guard: 'mitigate_security_retrieval_precision_risk',
        audit: 'audit_security_semantic_retrieval_signals',
        publish: 'publish_security_semantic_retrieval_status'
    },
    recommendationTargetMap: {
        rank_security_semantic_retrieval: 'agent:security',
        mitigate_security_retrieval_precision_risk: 'agent:policy',
        audit_security_semantic_retrieval_signals: 'agent:trust',
        publish_security_semantic_retrieval_status: 'agent:ops'
    }
});

export function rankSecuritySemanticRetrieval(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securitySemanticRetrievalRankerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecuritySemanticRetrievalRanker extends BaseManager {}

export const __securitySemanticRetrievalRankerInternals = toolkit.internals;
