import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_task_handoff_contractor',
    collectionField: 'handoffs',
    idField: 'handoffId',
    defaultName: 'Federation Handoff',
    readyPosture: 'federation_handoff_contract_ready',
    defaultAgentId: 'agent:federation-handoff',
    recommendationTypes: {
        primary: 'contract_federation_task_handoff',
        guard: 'mitigate_federation_handoff_mismatch',
        audit: 'audit_federation_handoff_signals',
        publish: 'publish_federation_handoff_status'
    },
    recommendationTargetMap: {
        contract_federation_task_handoff: 'agent:workflow',
        mitigate_federation_handoff_mismatch: 'agent:federation',
        audit_federation_handoff_signals: 'agent:trust',
        publish_federation_handoff_status: 'agent:ops'
    }
});

export function contractFederationTaskHandoffs(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationTaskHandoffContractorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationTaskHandoffContractor extends BaseManager {}

export const __federationTaskHandoffContractorInternals = toolkit.internals;
