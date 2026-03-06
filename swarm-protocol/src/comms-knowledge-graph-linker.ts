import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_knowledge_graph_linker',
    collectionField: 'entities',
    idField: 'entityId',
    defaultName: 'Comms Entity',
    readyPosture: 'comms_knowledge_graph_linked',
    defaultAgentId: 'agent:comms-knowledge-graph',
    recommendationTypes: {
        primary: 'link_comms_knowledge_graph',
        guard: 'mitigate_comms_knowledge_fragmentation',
        audit: 'audit_comms_knowledge_linking',
        publish: 'publish_comms_knowledge_graph_status'
    },
    recommendationTargetMap: {
        link_comms_knowledge_graph: 'agent:comms',
        mitigate_comms_knowledge_fragmentation: 'agent:architecture',
        audit_comms_knowledge_linking: 'agent:trust',
        publish_comms_knowledge_graph_status: 'agent:ops'
    }
});

export function linkCommsKnowledgeGraph(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsKnowledgeGraphLinkerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsKnowledgeGraphLinker extends BaseManager {}

export const __commsKnowledgeGraphLinkerInternals = toolkit.internals;
