import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_task_handoff_contractor',
    collectionField: 'handoffs',
    idField: 'handoffId',
    defaultName: 'PublicService Handoff',
    readyPosture: 'publicservice_handoff_contract_ready',
    defaultAgentId: 'agent:publicservice-handoff',
    recommendationTypes: {
        primary: 'contract_publicservice_task_handoff',
        guard: 'mitigate_publicservice_handoff_mismatch',
        audit: 'audit_publicservice_handoff_signals',
        publish: 'publish_publicservice_handoff_status'
    },
    recommendationTargetMap: {
        contract_publicservice_task_handoff: 'agent:workflow',
        mitigate_publicservice_handoff_mismatch: 'agent:publicservice',
        audit_publicservice_handoff_signals: 'agent:trust',
        publish_publicservice_handoff_status: 'agent:ops'
    }
});

export function contractPublicServiceTaskHandoffs(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceTaskHandoffContractorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceTaskHandoffContractor extends BaseManager {}

export const __publicServiceTaskHandoffContractorInternals = toolkit.internals;
