import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_memory_consolidation_pipeline',
    collectionField: 'memoryBatches',
    idField: 'batchId',
    defaultName: 'Governance Memory Batch',
    readyPosture: 'governance_memory_consolidation_ready',
    defaultAgentId: 'agent:governance-memory',
    recommendationTypes: {
        primary: 'consolidate_governance_memory',
        guard: 'mitigate_governance_memory_fragmentation',
        audit: 'audit_governance_memory_signals',
        publish: 'publish_governance_memory_status'
    },
    recommendationTargetMap: {
        consolidate_governance_memory: 'agent:governance',
        mitigate_governance_memory_fragmentation: 'agent:architecture',
        audit_governance_memory_signals: 'agent:trust',
        publish_governance_memory_status: 'agent:ops'
    }
});

export function consolidateGovernanceMemory(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceMemoryConsolidationPipelineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceMemoryConsolidationPipeline extends BaseManager {}

export const __governanceMemoryConsolidationPipelineInternals = toolkit.internals;
