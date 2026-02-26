import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_memory_consolidation_pipeline',
    collectionField: 'memoryBatches',
    idField: 'batchId',
    defaultName: 'Evolution Memory Batch',
    readyPosture: 'evolution_memory_consolidated',
    defaultAgentId: 'agent:evolution-memory',
    recommendationTypes: {
        primary: 'consolidate_evolution_memory',
        guard: 'mitigate_evolution_memory_fragmentation',
        audit: 'audit_evolution_memory_signals',
        publish: 'publish_evolution_memory_status'
    },
    recommendationTargetMap: {
        consolidate_evolution_memory: 'agent:evolution',
        mitigate_evolution_memory_fragmentation: 'agent:knowledge',
        audit_evolution_memory_signals: 'agent:trust',
        publish_evolution_memory_status: 'agent:ops'
    }
});

export function consolidateEvolutionMemory(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionMemoryConsolidationPipelineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionMemoryConsolidationPipeline extends BaseManager {}

export const __evolutionMemoryConsolidationPipelineInternals = toolkit.internals;
