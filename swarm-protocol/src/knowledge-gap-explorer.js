import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'knowledge_gap_explorer',
    collectionField: 'domains',
    idField: 'domainId',
    defaultName: 'Domain',
    readyPosture: 'knowledge_exploration_ready',
    defaultAgentId: 'agent:knowledge-gap-explorer',
    recommendationTypes: {
        primary: 'investigate_critical_unknown',
        guard: 'prioritize_gap_research',
        audit: 'audit_knowledge_gap_signal_quality',
        publish: 'publish_knowledge_gap_map'
    },
    recommendationTargetMap: {
        investigate_critical_unknown: 'agent:research',
        prioritize_gap_research: 'agent:planning',
        audit_knowledge_gap_signal_quality: 'agent:quality',
        publish_knowledge_gap_map: 'agent:ops'
    }
});

export function exploreKnowledgeGaps(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function knowledgeGapExplorerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class KnowledgeGapExplorer extends BaseManager {}

export const __knowledgeGapExplorerInternals = toolkit.internals;
