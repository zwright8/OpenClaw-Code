import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_task_handoff_contractor',
    collectionField: 'handoffs',
    idField: 'handoffId',
    defaultName: 'Collab Handoff',
    readyPosture: 'collab_handoff_contract_ready',
    defaultAgentId: 'agent:collab-handoff',
    recommendationTypes: {
        primary: 'contract_collab_task_handoff',
        guard: 'mitigate_collab_handoff_mismatch',
        audit: 'audit_collab_handoff_signals',
        publish: 'publish_collab_handoff_status'
    },
    recommendationTargetMap: {
        contract_collab_task_handoff: 'agent:workflow',
        mitigate_collab_handoff_mismatch: 'agent:collab',
        audit_collab_handoff_signals: 'agent:trust',
        publish_collab_handoff_status: 'agent:ops'
    }
});

export function contractCollabTaskHandoffs(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabTaskHandoffContractorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabTaskHandoffContractor extends BaseManager {}

export const __collabTaskHandoffContractorInternals = toolkit.internals;
