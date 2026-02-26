import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_knowledge_graph_linker',
    collectionField: 'entities',
    idField: 'entityId',
    defaultName: 'PublicService Entity',
    readyPosture: 'publicservice_knowledge_graph_linked',
    defaultAgentId: 'agent:publicservice-knowledge-graph',
    recommendationTypes: {
        primary: 'link_publicservice_knowledge_graph',
        guard: 'mitigate_publicservice_knowledge_fragmentation',
        audit: 'audit_publicservice_knowledge_linking',
        publish: 'publish_publicservice_knowledge_graph_status'
    },
    recommendationTargetMap: {
        link_publicservice_knowledge_graph: 'agent:publicservice',
        mitigate_publicservice_knowledge_fragmentation: 'agent:architecture',
        audit_publicservice_knowledge_linking: 'agent:trust',
        publish_publicservice_knowledge_graph_status: 'agent:ops'
    }
});

export function linkPublicServiceKnowledgeGraph(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceKnowledgeGraphLinkerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceKnowledgeGraphLinker extends BaseManager {}

export const __publicServiceKnowledgeGraphLinkerInternals = toolkit.internals;
