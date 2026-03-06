import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_memory_consolidation_pipeline',
    collectionField: 'memoryBatches',
    idField: 'batchId',
    defaultName: 'Economic Memory Batch',
    readyPosture: 'economic_memory_consolidation_ready',
    defaultAgentId: 'agent:economic-memory',
    recommendationTypes: {
        primary: 'consolidate_economic_memory',
        guard: 'mitigate_economic_memory_fragmentation',
        audit: 'audit_economic_memory_signals',
        publish: 'publish_economic_memory_status'
    },
    recommendationTargetMap: {
        consolidate_economic_memory: 'agent:economic',
        mitigate_economic_memory_fragmentation: 'agent:architecture',
        audit_economic_memory_signals: 'agent:trust',
        publish_economic_memory_status: 'agent:ops'
    }
});

export function consolidateEconomicMemory(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicMemoryConsolidationPipelineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicMemoryConsolidationPipeline extends BaseManager {}

export const __economicMemoryConsolidationPipelineInternals = toolkit.internals;
