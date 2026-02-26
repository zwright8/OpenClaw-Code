import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_knowledge_graph_linker',
    collectionField: 'entities',
    idField: 'entityId',
    defaultName: 'Crisis Entity',
    readyPosture: 'crisis_knowledge_graph_linked',
    defaultAgentId: 'agent:crisis-knowledge-graph',
    recommendationTypes: {
        primary: 'link_crisis_knowledge_graph',
        guard: 'mitigate_crisis_knowledge_fragmentation',
        audit: 'audit_crisis_knowledge_linking',
        publish: 'publish_crisis_knowledge_graph_status'
    },
    recommendationTargetMap: {
        link_crisis_knowledge_graph: 'agent:crisis',
        mitigate_crisis_knowledge_fragmentation: 'agent:architecture',
        audit_crisis_knowledge_linking: 'agent:trust',
        publish_crisis_knowledge_graph_status: 'agent:ops'
    }
});

export function linkCrisisKnowledgeGraph(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisKnowledgeGraphLinkerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisKnowledgeGraphLinker extends BaseManager {}

export const __crisisKnowledgeGraphLinkerInternals = toolkit.internals;
