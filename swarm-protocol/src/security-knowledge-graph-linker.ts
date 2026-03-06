import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_knowledge_graph_linker',
    collectionField: 'entities',
    idField: 'entityId',
    defaultName: 'Security Entity',
    readyPosture: 'security_knowledge_graph_linked',
    defaultAgentId: 'agent:security-knowledge-graph',
    recommendationTypes: {
        primary: 'link_security_knowledge_graph',
        guard: 'mitigate_security_knowledge_fragmentation',
        audit: 'audit_security_knowledge_linking',
        publish: 'publish_security_knowledge_graph_status'
    },
    recommendationTargetMap: {
        link_security_knowledge_graph: 'agent:security',
        mitigate_security_knowledge_fragmentation: 'agent:architecture',
        audit_security_knowledge_linking: 'agent:trust',
        publish_security_knowledge_graph_status: 'agent:ops'
    }
});

export function linkSecurityKnowledgeGraph(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityKnowledgeGraphLinkerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityKnowledgeGraphLinker extends BaseManager {}

export const __securityKnowledgeGraphLinkerInternals = toolkit.internals;
