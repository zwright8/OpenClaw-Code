import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_memory_consolidation_pipeline',
    collectionField: 'memoryBatches',
    idField: 'batchId',
    defaultName: 'Comms Memory Batch',
    readyPosture: 'comms_memory_consolidation_ready',
    defaultAgentId: 'agent:comms-memory',
    recommendationTypes: {
        primary: 'consolidate_comms_memory',
        guard: 'mitigate_comms_memory_fragmentation',
        audit: 'audit_comms_memory_signals',
        publish: 'publish_comms_memory_status'
    },
    recommendationTargetMap: {
        consolidate_comms_memory: 'agent:comms',
        mitigate_comms_memory_fragmentation: 'agent:architecture',
        audit_comms_memory_signals: 'agent:trust',
        publish_comms_memory_status: 'agent:ops'
    }
});

export function consolidateCommsMemory(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsMemoryConsolidationPipelineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsMemoryConsolidationPipeline extends BaseManager {}

export const __commsMemoryConsolidationPipelineInternals = toolkit.internals;
