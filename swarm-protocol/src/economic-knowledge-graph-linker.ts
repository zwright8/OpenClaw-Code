import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_knowledge_graph_linker',
    collectionField: 'entities',
    idField: 'entityId',
    defaultName: 'Economic Entity',
    readyPosture: 'economic_knowledge_graph_linked',
    defaultAgentId: 'agent:economic-knowledge-graph',
    recommendationTypes: {
        primary: 'link_economic_knowledge_graph',
        guard: 'mitigate_economic_knowledge_fragmentation',
        audit: 'audit_economic_knowledge_linking',
        publish: 'publish_economic_knowledge_graph_status'
    },
    recommendationTargetMap: {
        link_economic_knowledge_graph: 'agent:economic',
        mitigate_economic_knowledge_fragmentation: 'agent:architecture',
        audit_economic_knowledge_linking: 'agent:trust',
        publish_economic_knowledge_graph_status: 'agent:ops'
    }
});

export function linkEconomicKnowledgeGraph(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicKnowledgeGraphLinkerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicKnowledgeGraphLinker extends BaseManager {}

export const __economicKnowledgeGraphLinkerInternals = toolkit.internals;
