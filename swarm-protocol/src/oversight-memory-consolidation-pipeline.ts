import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_memory_consolidation_pipeline',
    collectionField: 'memoryBatches',
    idField: 'batchId',
    defaultName: 'Oversight Memory Batch',
    readyPosture: 'oversight_memory_consolidation_ready',
    defaultAgentId: 'agent:oversight-memory',
    recommendationTypes: {
        primary: 'consolidate_oversight_memory',
        guard: 'mitigate_oversight_memory_fragmentation',
        audit: 'audit_oversight_memory_signals',
        publish: 'publish_oversight_memory_status'
    },
    recommendationTargetMap: {
        consolidate_oversight_memory: 'agent:oversight',
        mitigate_oversight_memory_fragmentation: 'agent:architecture',
        audit_oversight_memory_signals: 'agent:trust',
        publish_oversight_memory_status: 'agent:ops'
    }
});

export function consolidateOversightMemory(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightMemoryConsolidationPipelineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightMemoryConsolidationPipeline extends BaseManager {}

export const __oversightMemoryConsolidationPipelineInternals = toolkit.internals;
