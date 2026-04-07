import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_knowledge_graph_linker',
    collectionField: 'entities',
    idField: 'entityId',
    defaultName: 'Engineering Entity',
    readyPosture: 'engineering_knowledge_graph_linked',
    defaultAgentId: 'agent:engineering-knowledge-graph',
    recommendationTypes: {
        primary: 'link_engineering_knowledge_graph',
        guard: 'mitigate_engineering_knowledge_fragmentation',
        audit: 'audit_engineering_knowledge_linking',
        publish: 'publish_engineering_knowledge_graph_status'
    },
    recommendationTargetMap: {
        link_engineering_knowledge_graph: 'agent:engineering',
        mitigate_engineering_knowledge_fragmentation: 'agent:architecture',
        audit_engineering_knowledge_linking: 'agent:trust',
        publish_engineering_knowledge_graph_status: 'agent:ops'
    }
});

export function linkEngineeringKnowledgeGraph(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringKnowledgeGraphLinkerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringKnowledgeGraphLinker extends BaseManager {}

export const __engineeringKnowledgeGraphLinkerInternals = toolkit.internals;
