import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_memory_consolidation_pipeline',
    collectionField: 'memoryBatches',
    idField: 'batchId',
    defaultName: 'Education Memory Batch',
    readyPosture: 'education_memory_consolidation_ready',
    defaultAgentId: 'agent:education-memory',
    recommendationTypes: {
        primary: 'consolidate_education_memory',
        guard: 'mitigate_education_memory_fragmentation',
        audit: 'audit_education_memory_signals',
        publish: 'publish_education_memory_status'
    },
    recommendationTargetMap: {
        consolidate_education_memory: 'agent:education',
        mitigate_education_memory_fragmentation: 'agent:architecture',
        audit_education_memory_signals: 'agent:trust',
        publish_education_memory_status: 'agent:ops'
    }
});

export function consolidateEducationMemory(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationMemoryConsolidationPipelineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationMemoryConsolidationPipeline extends BaseManager {}

export const __educationMemoryConsolidationPipelineInternals = toolkit.internals;
