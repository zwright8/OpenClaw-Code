import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_memory_consolidation_pipeline',
    collectionField: 'memoryBatches',
    idField: 'batchId',
    defaultName: 'Research Memory Batch',
    readyPosture: 'research_memory_consolidation_ready',
    defaultAgentId: 'agent:research-memory',
    recommendationTypes: {
        primary: 'consolidate_research_memory',
        guard: 'mitigate_research_memory_fragmentation',
        audit: 'audit_research_memory_signals',
        publish: 'publish_research_memory_status'
    },
    recommendationTargetMap: {
        consolidate_research_memory: 'agent:research',
        mitigate_research_memory_fragmentation: 'agent:architecture',
        audit_research_memory_signals: 'agent:trust',
        publish_research_memory_status: 'agent:ops'
    }
});

export function consolidateResearchMemory(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchMemoryConsolidationPipelineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchMemoryConsolidationPipeline extends BaseManager {}

export const __researchMemoryConsolidationPipelineInternals = toolkit.internals;
