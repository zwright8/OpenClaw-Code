import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_task_handoff_contractor',
    collectionField: 'handoffs',
    idField: 'handoffId',
    defaultName: 'Oversight Handoff',
    readyPosture: 'oversight_handoff_contract_ready',
    defaultAgentId: 'agent:oversight-handoff',
    recommendationTypes: {
        primary: 'contract_oversight_task_handoff',
        guard: 'mitigate_oversight_handoff_mismatch',
        audit: 'audit_oversight_handoff_signals',
        publish: 'publish_oversight_handoff_status'
    },
    recommendationTargetMap: {
        contract_oversight_task_handoff: 'agent:workflow',
        mitigate_oversight_handoff_mismatch: 'agent:oversight',
        audit_oversight_handoff_signals: 'agent:trust',
        publish_oversight_handoff_status: 'agent:ops'
    }
});

export function contractOversightTaskHandoffs(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightTaskHandoffContractorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightTaskHandoffContractor extends BaseManager {}

export const __oversightTaskHandoffContractorInternals = toolkit.internals;
