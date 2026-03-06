import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_memory_consolidation_pipeline',
    collectionField: 'memoryBatches',
    idField: 'batchId',
    defaultName: 'Community Memory Batch',
    readyPosture: 'community_memory_consolidated',
    defaultAgentId: 'agent:community-memory',
    recommendationTypes: {
        primary: 'consolidate_community_memory',
        guard: 'mitigate_community_memory_fragmentation',
        audit: 'audit_community_memory_signals',
        publish: 'publish_community_memory_status'
    },
    recommendationTargetMap: {
        consolidate_community_memory: 'agent:community',
        mitigate_community_memory_fragmentation: 'agent:knowledge',
        audit_community_memory_signals: 'agent:trust',
        publish_community_memory_status: 'agent:ops'
    }
});

export function consolidateCommunityMemory(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityMemoryConsolidationPipelineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityMemoryConsolidationPipeline extends BaseManager {}

export const __communityMemoryConsolidationPipelineInternals = toolkit.internals;
