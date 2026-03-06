import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_memory_consolidation_pipeline',
    collectionField: 'memoryBatches',
    idField: 'batchId',
    defaultName: 'Federation Memory Batch',
    readyPosture: 'federation_memory_consolidation_ready',
    defaultAgentId: 'agent:federation-memory',
    recommendationTypes: {
        primary: 'consolidate_federation_memory',
        guard: 'mitigate_federation_memory_fragmentation',
        audit: 'audit_federation_memory_signals',
        publish: 'publish_federation_memory_status'
    },
    recommendationTargetMap: {
        consolidate_federation_memory: 'agent:federation',
        mitigate_federation_memory_fragmentation: 'agent:architecture',
        audit_federation_memory_signals: 'agent:trust',
        publish_federation_memory_status: 'agent:ops'
    }
});

export function consolidateFederationMemory(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationMemoryConsolidationPipelineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationMemoryConsolidationPipeline extends BaseManager {}

export const __federationMemoryConsolidationPipelineInternals = toolkit.internals;
