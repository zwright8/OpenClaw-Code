import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_memory_consolidation_pipeline',
    collectionField: 'memoryBatches',
    idField: 'batchId',
    defaultName: 'PublicService Memory Batch',
    readyPosture: 'publicservice_memory_consolidation_ready',
    defaultAgentId: 'agent:publicservice-memory',
    recommendationTypes: {
        primary: 'consolidate_publicservice_memory',
        guard: 'mitigate_publicservice_memory_fragmentation',
        audit: 'audit_publicservice_memory_signals',
        publish: 'publish_publicservice_memory_status'
    },
    recommendationTargetMap: {
        consolidate_publicservice_memory: 'agent:publicservice',
        mitigate_publicservice_memory_fragmentation: 'agent:architecture',
        audit_publicservice_memory_signals: 'agent:trust',
        publish_publicservice_memory_status: 'agent:ops'
    }
});

export function consolidatePublicServiceMemory(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceMemoryConsolidationPipelineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceMemoryConsolidationPipeline extends BaseManager {}

export const __publicServiceMemoryConsolidationPipelineInternals = toolkit.internals;
