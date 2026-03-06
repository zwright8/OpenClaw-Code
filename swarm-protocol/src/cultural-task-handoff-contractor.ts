import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_task_handoff_contractor',
    collectionField: 'handoffs',
    idField: 'handoffId',
    defaultName: 'Cultural Handoff',
    readyPosture: 'cultural_handoff_contract_ready',
    defaultAgentId: 'agent:cultural-handoff',
    recommendationTypes: {
        primary: 'contract_cultural_task_handoff',
        guard: 'mitigate_cultural_handoff_mismatch',
        audit: 'audit_cultural_handoff_signals',
        publish: 'publish_cultural_handoff_status'
    },
    recommendationTargetMap: {
        contract_cultural_task_handoff: 'agent:workflow',
        mitigate_cultural_handoff_mismatch: 'agent:cultural',
        audit_cultural_handoff_signals: 'agent:trust',
        publish_cultural_handoff_status: 'agent:ops'
    }
});

export function contractCulturalTaskHandoffs(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalTaskHandoffContractorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalTaskHandoffContractor extends BaseManager {}

export const __culturalTaskHandoffContractorInternals = toolkit.internals;
