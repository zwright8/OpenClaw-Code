import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_knowledge_graph_linker',
    collectionField: 'entities',
    idField: 'entityId',
    defaultName: 'Evolution Entity',
    readyPosture: 'evolution_graph_linked',
    defaultAgentId: 'agent:evolution-knowledge-graph',
    recommendationTypes: {
        primary: 'link_evolution_knowledge_graph',
        guard: 'mitigate_evolution_graph_isolation',
        audit: 'audit_evolution_graph_signals',
        publish: 'publish_evolution_graph_status'
    },
    recommendationTargetMap: {
        link_evolution_knowledge_graph: 'agent:evolution',
        mitigate_evolution_graph_isolation: 'agent:knowledge',
        audit_evolution_graph_signals: 'agent:trust',
        publish_evolution_graph_status: 'agent:ops'
    }
});

export function linkEvolutionKnowledgeGraph(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionKnowledgeGraphLinkerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionKnowledgeGraphLinker extends BaseManager {}

export const __evolutionKnowledgeGraphLinkerInternals = toolkit.internals;
