import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_knowledge_graph_linker',
    collectionField: 'entities',
    idField: 'entityId',
    defaultName: 'Observability Entity',
    readyPosture: 'observability_knowledge_graph_linked',
    defaultAgentId: 'agent:observability-knowledge-graph',
    recommendationTypes: {
        primary: 'link_observability_knowledge_graph',
        guard: 'mitigate_observability_knowledge_fragmentation',
        audit: 'audit_observability_knowledge_linking',
        publish: 'publish_observability_knowledge_graph_status'
    },
    recommendationTargetMap: {
        link_observability_knowledge_graph: 'agent:observability',
        mitigate_observability_knowledge_fragmentation: 'agent:architecture',
        audit_observability_knowledge_linking: 'agent:trust',
        publish_observability_knowledge_graph_status: 'agent:ops'
    }
});

export function linkObservabilityKnowledgeGraph(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityKnowledgeGraphLinkerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityKnowledgeGraphLinker extends BaseManager {}

export const __observabilityKnowledgeGraphLinkerInternals = toolkit.internals;
