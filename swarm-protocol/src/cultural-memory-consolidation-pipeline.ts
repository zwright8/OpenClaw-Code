import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_memory_consolidation_pipeline',
    collectionField: 'memoryBatches',
    idField: 'batchId',
    defaultName: 'Cultural Memory Batch',
    readyPosture: 'cultural_memory_consolidated',
    defaultAgentId: 'agent:cultural-memory',
    recommendationTypes: {
        primary: 'consolidate_cultural_memory',
        guard: 'mitigate_cultural_memory_fragmentation',
        audit: 'audit_cultural_memory_signals',
        publish: 'publish_cultural_memory_status'
    },
    recommendationTargetMap: {
        consolidate_cultural_memory: 'agent:cultural',
        mitigate_cultural_memory_fragmentation: 'agent:knowledge',
        audit_cultural_memory_signals: 'agent:trust',
        publish_cultural_memory_status: 'agent:ops'
    }
});

export function consolidateCulturalMemory(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalMemoryConsolidationPipelineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalMemoryConsolidationPipeline extends BaseManager {}

export const __culturalMemoryConsolidationPipelineInternals = toolkit.internals;
