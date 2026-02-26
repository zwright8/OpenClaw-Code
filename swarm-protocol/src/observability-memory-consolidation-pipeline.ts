import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_memory_consolidation_pipeline',
    collectionField: 'memoryBatches',
    idField: 'batchId',
    defaultName: 'Observability Memory Batch',
    readyPosture: 'observability_memory_consolidation_ready',
    defaultAgentId: 'agent:observability-memory',
    recommendationTypes: {
        primary: 'consolidate_observability_memory',
        guard: 'mitigate_observability_memory_fragmentation',
        audit: 'audit_observability_memory_signals',
        publish: 'publish_observability_memory_status'
    },
    recommendationTargetMap: {
        consolidate_observability_memory: 'agent:observability',
        mitigate_observability_memory_fragmentation: 'agent:architecture',
        audit_observability_memory_signals: 'agent:trust',
        publish_observability_memory_status: 'agent:ops'
    }
});

export function consolidateObservabilityMemory(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityMemoryConsolidationPipelineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityMemoryConsolidationPipeline extends BaseManager {}

export const __observabilityMemoryConsolidationPipelineInternals = toolkit.internals;
