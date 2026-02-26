import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_knowledge_graph_linker',
    collectionField: 'entities',
    idField: 'entityId',
    defaultName: 'Collab Entity',
    readyPosture: 'collab_knowledge_graph_linked',
    defaultAgentId: 'agent:collab-knowledge-graph',
    recommendationTypes: {
        primary: 'link_collab_knowledge_graph',
        guard: 'mitigate_collab_knowledge_fragmentation',
        audit: 'audit_collab_knowledge_linking',
        publish: 'publish_collab_knowledge_graph_status'
    },
    recommendationTargetMap: {
        link_collab_knowledge_graph: 'agent:collab',
        mitigate_collab_knowledge_fragmentation: 'agent:architecture',
        audit_collab_knowledge_linking: 'agent:trust',
        publish_collab_knowledge_graph_status: 'agent:ops'
    }
});

export function linkCollabKnowledgeGraph(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabKnowledgeGraphLinkerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabKnowledgeGraphLinker extends BaseManager {}

export const __collabKnowledgeGraphLinkerInternals = toolkit.internals;
