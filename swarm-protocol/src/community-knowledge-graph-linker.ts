import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_knowledge_graph_linker',
    collectionField: 'entities',
    idField: 'entityId',
    defaultName: 'Community Entity',
    readyPosture: 'community_graph_linked',
    defaultAgentId: 'agent:community-knowledge-graph',
    recommendationTypes: {
        primary: 'link_community_knowledge_graph',
        guard: 'mitigate_community_graph_isolation',
        audit: 'audit_community_graph_signals',
        publish: 'publish_community_graph_status'
    },
    recommendationTargetMap: {
        link_community_knowledge_graph: 'agent:community',
        mitigate_community_graph_isolation: 'agent:knowledge',
        audit_community_graph_signals: 'agent:trust',
        publish_community_graph_status: 'agent:ops'
    }
});

export function linkCommunityKnowledgeGraph(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityKnowledgeGraphLinkerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityKnowledgeGraphLinker extends BaseManager {}

export const __communityKnowledgeGraphLinkerInternals = toolkit.internals;
