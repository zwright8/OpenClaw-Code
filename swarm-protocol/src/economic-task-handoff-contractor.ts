import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_task_handoff_contractor',
    collectionField: 'handoffs',
    idField: 'handoffId',
    defaultName: 'Economic Handoff',
    readyPosture: 'economic_handoff_contract_ready',
    defaultAgentId: 'agent:economic-handoff',
    recommendationTypes: {
        primary: 'contract_economic_task_handoff',
        guard: 'mitigate_economic_handoff_mismatch',
        audit: 'audit_economic_handoff_signals',
        publish: 'publish_economic_handoff_status'
    },
    recommendationTargetMap: {
        contract_economic_task_handoff: 'agent:workflow',
        mitigate_economic_handoff_mismatch: 'agent:economic',
        audit_economic_handoff_signals: 'agent:trust',
        publish_economic_handoff_status: 'agent:ops'
    }
});

export function contractEconomicTaskHandoffs(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicTaskHandoffContractorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicTaskHandoffContractor extends BaseManager {}

export const __economicTaskHandoffContractorInternals = toolkit.internals;
