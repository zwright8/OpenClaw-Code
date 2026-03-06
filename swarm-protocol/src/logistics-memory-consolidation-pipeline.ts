import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_memory_consolidation_pipeline',
    collectionField: 'memoryBatches',
    idField: 'batchId',
    defaultName: 'Logistics Memory Batch',
    readyPosture: 'logistics_memory_consolidation_ready',
    defaultAgentId: 'agent:logistics-memory',
    recommendationTypes: {
        primary: 'consolidate_logistics_memory',
        guard: 'mitigate_logistics_memory_fragmentation',
        audit: 'audit_logistics_memory_signals',
        publish: 'publish_logistics_memory_status'
    },
    recommendationTargetMap: {
        consolidate_logistics_memory: 'agent:logistics',
        mitigate_logistics_memory_fragmentation: 'agent:architecture',
        audit_logistics_memory_signals: 'agent:trust',
        publish_logistics_memory_status: 'agent:ops'
    }
});

export function consolidateLogisticsMemory(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsMemoryConsolidationPipelineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsMemoryConsolidationPipeline extends BaseManager {}

export const __logisticsMemoryConsolidationPipelineInternals = toolkit.internals;
