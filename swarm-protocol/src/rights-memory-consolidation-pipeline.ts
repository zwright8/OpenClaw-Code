import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_memory_consolidation_pipeline',
    collectionField: 'memoryBatches',
    idField: 'batchId',
    defaultName: 'Rights Memory Batch',
    readyPosture: 'rights_memory_consolidated',
    defaultAgentId: 'agent:rights-memory',
    recommendationTypes: {
        primary: 'consolidate_rights_memory',
        guard: 'mitigate_rights_memory_fragmentation',
        audit: 'audit_rights_memory_signals',
        publish: 'publish_rights_memory_status'
    },
    recommendationTargetMap: {
        consolidate_rights_memory: 'agent:rights',
        mitigate_rights_memory_fragmentation: 'agent:knowledge',
        audit_rights_memory_signals: 'agent:trust',
        publish_rights_memory_status: 'agent:ops'
    }
});

export function consolidateRightsMemory(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsMemoryConsolidationPipelineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsMemoryConsolidationPipeline extends BaseManager {}

export const __rightsMemoryConsolidationPipelineInternals = toolkit.internals;
