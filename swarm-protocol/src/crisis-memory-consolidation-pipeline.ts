import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_memory_consolidation_pipeline',
    collectionField: 'memoryBatches',
    idField: 'batchId',
    defaultName: 'Crisis Memory Batch',
    readyPosture: 'crisis_memory_consolidation_ready',
    defaultAgentId: 'agent:crisis-memory',
    recommendationTypes: {
        primary: 'consolidate_crisis_memory',
        guard: 'mitigate_crisis_memory_fragmentation',
        audit: 'audit_crisis_memory_signals',
        publish: 'publish_crisis_memory_status'
    },
    recommendationTargetMap: {
        consolidate_crisis_memory: 'agent:crisis',
        mitigate_crisis_memory_fragmentation: 'agent:architecture',
        audit_crisis_memory_signals: 'agent:trust',
        publish_crisis_memory_status: 'agent:ops'
    }
});

export function consolidateCrisisMemory(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisMemoryConsolidationPipelineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisMemoryConsolidationPipeline extends BaseManager {}

export const __crisisMemoryConsolidationPipelineInternals = toolkit.internals;
