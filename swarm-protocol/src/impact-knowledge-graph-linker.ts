import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_knowledge_graph_linker',
    collectionField: 'entities',
    idField: 'entityId',
    defaultName: 'Impact Entity',
    readyPosture: 'impact_knowledge_graph_linked',
    defaultAgentId: 'agent:impact-knowledge-graph',
    recommendationTypes: {
        primary: 'link_impact_knowledge_graph',
        guard: 'mitigate_impact_knowledge_fragmentation',
        audit: 'audit_impact_knowledge_linking',
        publish: 'publish_impact_knowledge_graph_status'
    },
    recommendationTargetMap: {
        link_impact_knowledge_graph: 'agent:impact',
        mitigate_impact_knowledge_fragmentation: 'agent:architecture',
        audit_impact_knowledge_linking: 'agent:trust',
        publish_impact_knowledge_graph_status: 'agent:ops'
    }
});

export function linkImpactKnowledgeGraph(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactKnowledgeGraphLinkerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactKnowledgeGraphLinker extends BaseManager {}

export const __impactKnowledgeGraphLinkerInternals = toolkit.internals;
