import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_knowledge_graph_linker',
    collectionField: 'entities',
    idField: 'entityId',
    defaultName: 'Infra Entity',
    readyPosture: 'infra_graph_linked',
    defaultAgentId: 'agent:infra-knowledge-graph',
    recommendationTypes: {
        primary: 'link_infra_knowledge_graph',
        guard: 'mitigate_infra_graph_isolation',
        audit: 'audit_infra_graph_signals',
        publish: 'publish_infra_graph_status'
    },
    recommendationTargetMap: {
        link_infra_knowledge_graph: 'agent:infra',
        mitigate_infra_graph_isolation: 'agent:knowledge',
        audit_infra_graph_signals: 'agent:trust',
        publish_infra_graph_status: 'agent:ops'
    }
});

export function linkInfraKnowledgeGraph(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraKnowledgeGraphLinkerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraKnowledgeGraphLinker extends BaseManager {}

export const __infraKnowledgeGraphLinkerInternals = toolkit.internals;
