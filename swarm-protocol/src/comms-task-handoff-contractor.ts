import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_task_handoff_contractor',
    collectionField: 'handoffs',
    idField: 'handoffId',
    defaultName: 'Comms Handoff',
    readyPosture: 'comms_handoff_contract_ready',
    defaultAgentId: 'agent:comms-handoff',
    recommendationTypes: {
        primary: 'contract_comms_task_handoff',
        guard: 'mitigate_comms_handoff_mismatch',
        audit: 'audit_comms_handoff_signals',
        publish: 'publish_comms_handoff_status'
    },
    recommendationTargetMap: {
        contract_comms_task_handoff: 'agent:workflow',
        mitigate_comms_handoff_mismatch: 'agent:comms',
        audit_comms_handoff_signals: 'agent:trust',
        publish_comms_handoff_status: 'agent:ops'
    }
});

export function contractCommsTaskHandoffs(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsTaskHandoffContractorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsTaskHandoffContractor extends BaseManager {}

export const __commsTaskHandoffContractorInternals = toolkit.internals;
