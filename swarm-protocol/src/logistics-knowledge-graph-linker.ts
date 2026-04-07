import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_knowledge_graph_linker',
    collectionField: 'entities',
    idField: 'entityId',
    defaultName: 'Logistics Entity',
    readyPosture: 'logistics_knowledge_graph_linked',
    defaultAgentId: 'agent:logistics-knowledge-graph',
    recommendationTypes: {
        primary: 'link_logistics_knowledge_graph',
        guard: 'mitigate_logistics_knowledge_fragmentation',
        audit: 'audit_logistics_knowledge_linking',
        publish: 'publish_logistics_knowledge_graph_status'
    },
    recommendationTargetMap: {
        link_logistics_knowledge_graph: 'agent:logistics',
        mitigate_logistics_knowledge_fragmentation: 'agent:architecture',
        audit_logistics_knowledge_linking: 'agent:trust',
        publish_logistics_knowledge_graph_status: 'agent:ops'
    }
});

export function linkLogisticsKnowledgeGraph(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsKnowledgeGraphLinkerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsKnowledgeGraphLinker extends BaseManager {}

export const __logisticsKnowledgeGraphLinkerInternals = toolkit.internals;
