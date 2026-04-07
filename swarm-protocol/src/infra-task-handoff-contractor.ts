import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_task_handoff_contractor',
    collectionField: 'handoffs',
    idField: 'handoffId',
    defaultName: 'Infra Handoff',
    readyPosture: 'infra_handoff_contract_ready',
    defaultAgentId: 'agent:infra-handoff',
    recommendationTypes: {
        primary: 'contract_infra_task_handoff',
        guard: 'mitigate_infra_handoff_mismatch',
        audit: 'audit_infra_handoff_signals',
        publish: 'publish_infra_handoff_status'
    },
    recommendationTargetMap: {
        contract_infra_task_handoff: 'agent:workflow',
        mitigate_infra_handoff_mismatch: 'agent:infra',
        audit_infra_handoff_signals: 'agent:trust',
        publish_infra_handoff_status: 'agent:ops'
    }
});

export function contractInfraTaskHandoffs(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraTaskHandoffContractorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraTaskHandoffContractor extends BaseManager {}

export const __infraTaskHandoffContractorInternals = toolkit.internals;
