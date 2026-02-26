import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_knowledge_graph_linker',
    collectionField: 'entities',
    idField: 'entityId',
    defaultName: 'Cultural Entity',
    readyPosture: 'cultural_graph_linked',
    defaultAgentId: 'agent:cultural-knowledge-graph',
    recommendationTypes: {
        primary: 'link_cultural_knowledge_graph',
        guard: 'mitigate_cultural_graph_isolation',
        audit: 'audit_cultural_graph_signals',
        publish: 'publish_cultural_graph_status'
    },
    recommendationTargetMap: {
        link_cultural_knowledge_graph: 'agent:cultural',
        mitigate_cultural_graph_isolation: 'agent:knowledge',
        audit_cultural_graph_signals: 'agent:trust',
        publish_cultural_graph_status: 'agent:ops'
    }
});

export function linkCulturalKnowledgeGraph(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalKnowledgeGraphLinkerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalKnowledgeGraphLinker extends BaseManager {}

export const __culturalKnowledgeGraphLinkerInternals = toolkit.internals;
