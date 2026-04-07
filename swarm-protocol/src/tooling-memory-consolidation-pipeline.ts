import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'tooling_memory_consolidation_pipeline',
    collectionField: 'memoryBatches',
    idField: 'batchId',
    defaultName: 'Memory Batch',
    readyPosture: 'memory_consolidation_ready',
    defaultAgentId: 'agent:tooling-memory-consolidation',
    recommendationTypes: {
        primary: 'consolidate_tooling_memory_batch',
        guard: 'mitigate_memory_fragmentation_risk',
        audit: 'audit_memory_consolidation_signals',
        publish: 'publish_memory_consolidation_status'
    },
    recommendationTargetMap: {
        consolidate_tooling_memory_batch: 'agent:memory',
        mitigate_memory_fragmentation_risk: 'agent:architecture',
        audit_memory_consolidation_signals: 'agent:trust',
        publish_memory_consolidation_status: 'agent:ops'
    }
});

export function consolidateToolingMemory(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function toolingMemoryConsolidationToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ToolingMemoryConsolidationPipeline extends BaseManager {}

export const __toolingMemoryConsolidationPipelineInternals = toolkit.internals;
