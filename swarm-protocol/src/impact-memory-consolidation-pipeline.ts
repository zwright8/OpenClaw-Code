import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_memory_consolidation_pipeline',
    collectionField: 'memoryBatches',
    idField: 'batchId',
    defaultName: 'Impact Memory Batch',
    readyPosture: 'impact_memory_consolidation_ready',
    defaultAgentId: 'agent:impact-memory',
    recommendationTypes: {
        primary: 'consolidate_impact_memory',
        guard: 'mitigate_impact_memory_fragmentation',
        audit: 'audit_impact_memory_signals',
        publish: 'publish_impact_memory_status'
    },
    recommendationTargetMap: {
        consolidate_impact_memory: 'agent:impact',
        mitigate_impact_memory_fragmentation: 'agent:architecture',
        audit_impact_memory_signals: 'agent:trust',
        publish_impact_memory_status: 'agent:ops'
    }
});

export function consolidateImpactMemory(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactMemoryConsolidationPipelineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactMemoryConsolidationPipeline extends BaseManager {}

export const __impactMemoryConsolidationPipelineInternals = toolkit.internals;
