import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_task_handoff_contractor',
    collectionField: 'handoffs',
    idField: 'handoffId',
    defaultName: 'Crisis Handoff',
    readyPosture: 'crisis_handoff_contract_ready',
    defaultAgentId: 'agent:crisis-handoff',
    recommendationTypes: {
        primary: 'contract_crisis_task_handoff',
        guard: 'mitigate_crisis_handoff_mismatch',
        audit: 'audit_crisis_handoff_signals',
        publish: 'publish_crisis_handoff_status'
    },
    recommendationTargetMap: {
        contract_crisis_task_handoff: 'agent:workflow',
        mitigate_crisis_handoff_mismatch: 'agent:crisis',
        audit_crisis_handoff_signals: 'agent:trust',
        publish_crisis_handoff_status: 'agent:ops'
    }
});

export function contractCrisisTaskHandoffs(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisTaskHandoffContractorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisTaskHandoffContractor extends BaseManager {}

export const __crisisTaskHandoffContractorInternals = toolkit.internals;
