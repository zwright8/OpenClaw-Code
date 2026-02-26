import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_knowledge_graph_linker',
    collectionField: 'entities',
    idField: 'entityId',
    defaultName: 'Education Entity',
    readyPosture: 'education_knowledge_graph_linked',
    defaultAgentId: 'agent:education-knowledge-graph',
    recommendationTypes: {
        primary: 'link_education_knowledge_graph',
        guard: 'mitigate_education_knowledge_fragmentation',
        audit: 'audit_education_knowledge_linking',
        publish: 'publish_education_knowledge_graph_status'
    },
    recommendationTargetMap: {
        link_education_knowledge_graph: 'agent:education',
        mitigate_education_knowledge_fragmentation: 'agent:architecture',
        audit_education_knowledge_linking: 'agent:trust',
        publish_education_knowledge_graph_status: 'agent:ops'
    }
});

export function linkEducationKnowledgeGraph(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationKnowledgeGraphLinkerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationKnowledgeGraphLinker extends BaseManager {}

export const __educationKnowledgeGraphLinkerInternals = toolkit.internals;
