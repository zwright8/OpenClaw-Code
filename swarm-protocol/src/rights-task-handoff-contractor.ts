import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_task_handoff_contractor',
    collectionField: 'handoffs',
    idField: 'handoffId',
    defaultName: 'Rights Handoff',
    readyPosture: 'rights_handoff_contract_ready',
    defaultAgentId: 'agent:rights-handoff',
    recommendationTypes: {
        primary: 'contract_rights_task_handoff',
        guard: 'mitigate_rights_handoff_mismatch',
        audit: 'audit_rights_handoff_signals',
        publish: 'publish_rights_handoff_status'
    },
    recommendationTargetMap: {
        contract_rights_task_handoff: 'agent:workflow',
        mitigate_rights_handoff_mismatch: 'agent:rights',
        audit_rights_handoff_signals: 'agent:trust',
        publish_rights_handoff_status: 'agent:ops'
    }
});

export function contractRightsTaskHandoffs(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsTaskHandoffContractorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsTaskHandoffContractor extends BaseManager {}

export const __rightsTaskHandoffContractorInternals = toolkit.internals;
