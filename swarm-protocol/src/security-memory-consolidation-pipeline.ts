import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_memory_consolidation_pipeline',
    collectionField: 'memoryBatches',
    idField: 'batchId',
    defaultName: 'Security Memory Batch',
    readyPosture: 'security_memory_consolidation_ready',
    defaultAgentId: 'agent:security-memory',
    recommendationTypes: {
        primary: 'consolidate_security_memory',
        guard: 'mitigate_security_memory_fragmentation',
        audit: 'audit_security_memory_signals',
        publish: 'publish_security_memory_status'
    },
    recommendationTargetMap: {
        consolidate_security_memory: 'agent:security',
        mitigate_security_memory_fragmentation: 'agent:architecture',
        audit_security_memory_signals: 'agent:trust',
        publish_security_memory_status: 'agent:ops'
    }
});

export function consolidateSecurityMemory(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityMemoryConsolidationPipelineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityMemoryConsolidationPipeline extends BaseManager {}

export const __securityMemoryConsolidationPipelineInternals = toolkit.internals;
