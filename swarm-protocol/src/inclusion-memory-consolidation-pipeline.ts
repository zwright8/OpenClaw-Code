import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_memory_consolidation_pipeline',
    collectionField: 'memoryBatches',
    idField: 'batchId',
    defaultName: 'Inclusion Memory Batch',
    readyPosture: 'inclusion_memory_consolidated',
    defaultAgentId: 'agent:inclusion-memory',
    recommendationTypes: {
        primary: 'consolidate_inclusion_memory',
        guard: 'mitigate_inclusion_memory_fragmentation',
        audit: 'audit_inclusion_memory_signals',
        publish: 'publish_inclusion_memory_status'
    },
    recommendationTargetMap: {
        consolidate_inclusion_memory: 'agent:inclusion',
        mitigate_inclusion_memory_fragmentation: 'agent:knowledge',
        audit_inclusion_memory_signals: 'agent:trust',
        publish_inclusion_memory_status: 'agent:ops'
    }
});

export function consolidateInclusionMemory(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionMemoryConsolidationPipelineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionMemoryConsolidationPipeline extends BaseManager {}

export const __inclusionMemoryConsolidationPipelineInternals = toolkit.internals;
