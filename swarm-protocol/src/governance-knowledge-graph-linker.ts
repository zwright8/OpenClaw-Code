import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_knowledge_graph_linker',
    collectionField: 'entities',
    idField: 'entityId',
    defaultName: 'Governance Entity',
    readyPosture: 'governance_knowledge_graph_linked',
    defaultAgentId: 'agent:governance-knowledge-graph',
    recommendationTypes: {
        primary: 'link_governance_knowledge_graph',
        guard: 'mitigate_governance_knowledge_fragmentation',
        audit: 'audit_governance_knowledge_linking',
        publish: 'publish_governance_knowledge_graph_status'
    },
    recommendationTargetMap: {
        link_governance_knowledge_graph: 'agent:governance',
        mitigate_governance_knowledge_fragmentation: 'agent:architecture',
        audit_governance_knowledge_linking: 'agent:trust',
        publish_governance_knowledge_graph_status: 'agent:ops'
    }
});

export function linkGovernanceKnowledgeGraph(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceKnowledgeGraphLinkerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceKnowledgeGraphLinker extends BaseManager {}

export const __governanceKnowledgeGraphLinkerInternals = toolkit.internals;
