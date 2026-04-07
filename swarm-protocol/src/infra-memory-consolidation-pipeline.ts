import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_memory_consolidation_pipeline',
    collectionField: 'memoryBatches',
    idField: 'batchId',
    defaultName: 'Infra Memory Batch',
    readyPosture: 'infra_memory_consolidated',
    defaultAgentId: 'agent:infra-memory',
    recommendationTypes: {
        primary: 'consolidate_infra_memory',
        guard: 'mitigate_infra_memory_fragmentation',
        audit: 'audit_infra_memory_signals',
        publish: 'publish_infra_memory_status'
    },
    recommendationTargetMap: {
        consolidate_infra_memory: 'agent:infra',
        mitigate_infra_memory_fragmentation: 'agent:knowledge',
        audit_infra_memory_signals: 'agent:trust',
        publish_infra_memory_status: 'agent:ops'
    }
});

export function consolidateInfraMemory(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraMemoryConsolidationPipelineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraMemoryConsolidationPipeline extends BaseManager {}

export const __infraMemoryConsolidationPipelineInternals = toolkit.internals;
