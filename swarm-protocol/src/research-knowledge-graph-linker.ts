import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_knowledge_graph_linker',
    collectionField: 'entities',
    idField: 'entityId',
    defaultName: 'Research Entity',
    readyPosture: 'research_knowledge_graph_linked',
    defaultAgentId: 'agent:research-knowledge-graph',
    recommendationTypes: {
        primary: 'link_research_knowledge_graph',
        guard: 'mitigate_research_knowledge_fragmentation',
        audit: 'audit_research_knowledge_linking',
        publish: 'publish_research_knowledge_graph_status'
    },
    recommendationTargetMap: {
        link_research_knowledge_graph: 'agent:research',
        mitigate_research_knowledge_fragmentation: 'agent:architecture',
        audit_research_knowledge_linking: 'agent:trust',
        publish_research_knowledge_graph_status: 'agent:ops'
    }
});

export function linkResearchKnowledgeGraph(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchKnowledgeGraphLinkerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchKnowledgeGraphLinker extends BaseManager {}

export const __researchKnowledgeGraphLinkerInternals = toolkit.internals;
