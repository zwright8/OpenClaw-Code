import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_task_handoff_contractor',
    collectionField: 'handoffs',
    idField: 'handoffId',
    defaultName: 'Logistics Handoff',
    readyPosture: 'logistics_handoff_contract_ready',
    defaultAgentId: 'agent:logistics-handoff',
    recommendationTypes: {
        primary: 'contract_logistics_task_handoff',
        guard: 'mitigate_logistics_handoff_mismatch',
        audit: 'audit_logistics_handoff_signals',
        publish: 'publish_logistics_handoff_status'
    },
    recommendationTargetMap: {
        contract_logistics_task_handoff: 'agent:workflow',
        mitigate_logistics_handoff_mismatch: 'agent:logistics',
        audit_logistics_handoff_signals: 'agent:trust',
        publish_logistics_handoff_status: 'agent:ops'
    }
});

export function contractLogisticsTaskHandoffs(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsTaskHandoffContractorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsTaskHandoffContractor extends BaseManager {}

export const __logisticsTaskHandoffContractorInternals = toolkit.internals;
