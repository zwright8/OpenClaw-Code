import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_task_handoff_contractor',
    collectionField: 'handoffs',
    idField: 'handoffId',
    defaultName: 'Inclusion Handoff',
    readyPosture: 'inclusion_handoff_contract_ready',
    defaultAgentId: 'agent:inclusion-handoff',
    recommendationTypes: {
        primary: 'contract_inclusion_task_handoff',
        guard: 'mitigate_inclusion_handoff_mismatch',
        audit: 'audit_inclusion_handoff_signals',
        publish: 'publish_inclusion_handoff_status'
    },
    recommendationTargetMap: {
        contract_inclusion_task_handoff: 'agent:workflow',
        mitigate_inclusion_handoff_mismatch: 'agent:inclusion',
        audit_inclusion_handoff_signals: 'agent:trust',
        publish_inclusion_handoff_status: 'agent:ops'
    }
});

export function contractInclusionTaskHandoffs(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionTaskHandoffContractorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionTaskHandoffContractor extends BaseManager {}

export const __inclusionTaskHandoffContractorInternals = toolkit.internals;
