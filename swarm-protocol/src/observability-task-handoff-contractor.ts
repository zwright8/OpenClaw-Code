import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_task_handoff_contractor',
    collectionField: 'handoffs',
    idField: 'handoffId',
    defaultName: 'Observability Handoff',
    readyPosture: 'observability_handoff_contract_ready',
    defaultAgentId: 'agent:observability-handoff',
    recommendationTypes: {
        primary: 'contract_observability_task_handoff',
        guard: 'mitigate_observability_handoff_mismatch',
        audit: 'audit_observability_handoff_signals',
        publish: 'publish_observability_handoff_status'
    },
    recommendationTargetMap: {
        contract_observability_task_handoff: 'agent:workflow',
        mitigate_observability_handoff_mismatch: 'agent:observability',
        audit_observability_handoff_signals: 'agent:trust',
        publish_observability_handoff_status: 'agent:ops'
    }
});

export function contractObservabilityTaskHandoffs(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityTaskHandoffContractorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityTaskHandoffContractor extends BaseManager {}

export const __observabilityTaskHandoffContractorInternals = toolkit.internals;
