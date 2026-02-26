import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_knowledge_graph_linker',
    collectionField: 'entities',
    idField: 'entityId',
    defaultName: 'Rights Entity',
    readyPosture: 'rights_graph_linked',
    defaultAgentId: 'agent:rights-knowledge-graph',
    recommendationTypes: {
        primary: 'link_rights_knowledge_graph',
        guard: 'mitigate_rights_graph_isolation',
        audit: 'audit_rights_graph_signals',
        publish: 'publish_rights_graph_status'
    },
    recommendationTargetMap: {
        link_rights_knowledge_graph: 'agent:rights',
        mitigate_rights_graph_isolation: 'agent:knowledge',
        audit_rights_graph_signals: 'agent:trust',
        publish_rights_graph_status: 'agent:ops'
    }
});

export function linkRightsKnowledgeGraph(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsKnowledgeGraphLinkerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsKnowledgeGraphLinker extends BaseManager {}

export const __rightsKnowledgeGraphLinkerInternals = toolkit.internals;
