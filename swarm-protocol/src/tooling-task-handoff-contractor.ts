import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'tooling_task_handoff_contractor',
    collectionField: 'handoffs',
    idField: 'handoffId',
    defaultName: 'Handoff',
    readyPosture: 'handoff_contract_ready',
    defaultAgentId: 'agent:tooling-handoff-contractor',
    recommendationTypes: {
        primary: 'contract_task_handoff_payload',
        guard: 'mitigate_handoff_mismatch_risk',
        audit: 'audit_handoff_contract_signals',
        publish: 'publish_handoff_contract_status'
    },
    recommendationTargetMap: {
        contract_task_handoff_payload: 'agent:workflow',
        mitigate_handoff_mismatch_risk: 'agent:governance',
        audit_handoff_contract_signals: 'agent:trust',
        publish_handoff_contract_status: 'agent:ops'
    }
});

export function contractToolingTaskHandoffs(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function toolingTaskHandoffContractorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ToolingTaskHandoffContractor extends BaseManager {}

export const __toolingTaskHandoffContractorInternals = toolkit.internals;
