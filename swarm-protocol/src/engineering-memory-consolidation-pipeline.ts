import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_memory_consolidation_pipeline',
    collectionField: 'memoryBatches',
    idField: 'batchId',
    defaultName: 'Engineering Memory Batch',
    readyPosture: 'engineering_memory_consolidation_ready',
    defaultAgentId: 'agent:engineering-memory',
    recommendationTypes: {
        primary: 'consolidate_engineering_memory',
        guard: 'mitigate_engineering_memory_fragmentation',
        audit: 'audit_engineering_memory_signals',
        publish: 'publish_engineering_memory_status'
    },
    recommendationTargetMap: {
        consolidate_engineering_memory: 'agent:engineering',
        mitigate_engineering_memory_fragmentation: 'agent:architecture',
        audit_engineering_memory_signals: 'agent:trust',
        publish_engineering_memory_status: 'agent:ops'
    }
});

export function consolidateEngineeringMemory(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringMemoryConsolidationPipelineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringMemoryConsolidationPipeline extends BaseManager {}

export const __engineeringMemoryConsolidationPipelineInternals = toolkit.internals;
