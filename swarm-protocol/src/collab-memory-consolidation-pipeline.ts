import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_memory_consolidation_pipeline',
    collectionField: 'memoryBatches',
    idField: 'batchId',
    defaultName: 'Collab Memory Batch',
    readyPosture: 'collab_memory_consolidation_ready',
    defaultAgentId: 'agent:collab-memory',
    recommendationTypes: {
        primary: 'consolidate_collab_memory',
        guard: 'mitigate_collab_memory_fragmentation',
        audit: 'audit_collab_memory_signals',
        publish: 'publish_collab_memory_status'
    },
    recommendationTargetMap: {
        consolidate_collab_memory: 'agent:collab',
        mitigate_collab_memory_fragmentation: 'agent:architecture',
        audit_collab_memory_signals: 'agent:trust',
        publish_collab_memory_status: 'agent:ops'
    }
});

export function consolidateCollabMemory(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabMemoryConsolidationPipelineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabMemoryConsolidationPipeline extends BaseManager {}

export const __collabMemoryConsolidationPipelineInternals = toolkit.internals;
