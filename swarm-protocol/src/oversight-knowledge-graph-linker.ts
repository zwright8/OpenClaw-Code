import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_knowledge_graph_linker',
    collectionField: 'entities',
    idField: 'entityId',
    defaultName: 'Oversight Entity',
    readyPosture: 'oversight_knowledge_graph_linked',
    defaultAgentId: 'agent:oversight-knowledge-graph',
    recommendationTypes: {
        primary: 'link_oversight_knowledge_graph',
        guard: 'mitigate_oversight_knowledge_fragmentation',
        audit: 'audit_oversight_knowledge_linking',
        publish: 'publish_oversight_knowledge_graph_status'
    },
    recommendationTargetMap: {
        link_oversight_knowledge_graph: 'agent:oversight',
        mitigate_oversight_knowledge_fragmentation: 'agent:architecture',
        audit_oversight_knowledge_linking: 'agent:trust',
        publish_oversight_knowledge_graph_status: 'agent:ops'
    }
});

export function linkOversightKnowledgeGraph(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightKnowledgeGraphLinkerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightKnowledgeGraphLinker extends BaseManager {}

export const __oversightKnowledgeGraphLinkerInternals = toolkit.internals;
