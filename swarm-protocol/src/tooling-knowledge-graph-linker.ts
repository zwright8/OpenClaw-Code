import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'tooling_knowledge_graph_linker',
    collectionField: 'entities',
    idField: 'entityId',
    defaultName: 'Entity',
    readyPosture: 'knowledge_graph_linked',
    defaultAgentId: 'agent:tooling-knowledge-graph',
    recommendationTypes: {
        primary: 'link_tooling_knowledge_entities',
        guard: 'mitigate_knowledge_fragmentation_risk',
        audit: 'audit_knowledge_linking_signals',
        publish: 'publish_knowledge_graph_status'
    },
    recommendationTargetMap: {
        link_tooling_knowledge_entities: 'agent:knowledge',
        mitigate_knowledge_fragmentation_risk: 'agent:architecture',
        audit_knowledge_linking_signals: 'agent:trust',
        publish_knowledge_graph_status: 'agent:ops'
    }
});

export function linkToolingKnowledgeGraph(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function toolingKnowledgeGraphLinkerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ToolingKnowledgeGraphLinker extends BaseManager {}

export const __toolingKnowledgeGraphLinkerInternals = toolkit.internals;
