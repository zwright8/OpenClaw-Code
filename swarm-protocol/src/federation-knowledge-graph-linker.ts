import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_knowledge_graph_linker',
    collectionField: 'entities',
    idField: 'entityId',
    defaultName: 'Federation Entity',
    readyPosture: 'federation_knowledge_graph_linked',
    defaultAgentId: 'agent:federation-knowledge-graph',
    recommendationTypes: {
        primary: 'link_federation_knowledge_graph',
        guard: 'mitigate_federation_knowledge_fragmentation',
        audit: 'audit_federation_knowledge_linking',
        publish: 'publish_federation_knowledge_graph_status'
    },
    recommendationTargetMap: {
        link_federation_knowledge_graph: 'agent:federation',
        mitigate_federation_knowledge_fragmentation: 'agent:architecture',
        audit_federation_knowledge_linking: 'agent:trust',
        publish_federation_knowledge_graph_status: 'agent:ops'
    }
});

export function linkFederationKnowledgeGraph(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationKnowledgeGraphLinkerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationKnowledgeGraphLinker extends BaseManager {}

export const __federationKnowledgeGraphLinkerInternals = toolkit.internals;
