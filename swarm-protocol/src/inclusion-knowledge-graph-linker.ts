import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_knowledge_graph_linker',
    collectionField: 'entities',
    idField: 'entityId',
    defaultName: 'Inclusion Entity',
    readyPosture: 'inclusion_graph_linked',
    defaultAgentId: 'agent:inclusion-knowledge-graph',
    recommendationTypes: {
        primary: 'link_inclusion_knowledge_graph',
        guard: 'mitigate_inclusion_graph_isolation',
        audit: 'audit_inclusion_graph_signals',
        publish: 'publish_inclusion_graph_status'
    },
    recommendationTargetMap: {
        link_inclusion_knowledge_graph: 'agent:inclusion',
        mitigate_inclusion_graph_isolation: 'agent:knowledge',
        audit_inclusion_graph_signals: 'agent:trust',
        publish_inclusion_graph_status: 'agent:ops'
    }
});

export function linkInclusionKnowledgeGraph(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionKnowledgeGraphLinkerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionKnowledgeGraphLinker extends BaseManager {}

export const __inclusionKnowledgeGraphLinkerInternals = toolkit.internals;
