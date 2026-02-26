import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_task_handoff_contractor',
    collectionField: 'handoffs',
    idField: 'handoffId',
    defaultName: 'Engineering Handoff',
    readyPosture: 'engineering_handoff_contract_ready',
    defaultAgentId: 'agent:engineering-handoff',
    recommendationTypes: {
        primary: 'contract_engineering_task_handoff',
        guard: 'mitigate_engineering_handoff_mismatch',
        audit: 'audit_engineering_handoff_signals',
        publish: 'publish_engineering_handoff_status'
    },
    recommendationTargetMap: {
        contract_engineering_task_handoff: 'agent:workflow',
        mitigate_engineering_handoff_mismatch: 'agent:engineering',
        audit_engineering_handoff_signals: 'agent:trust',
        publish_engineering_handoff_status: 'agent:ops'
    }
});

export function contractEngineeringTaskHandoffs(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringTaskHandoffContractorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringTaskHandoffContractor extends BaseManager {}

export const __engineeringTaskHandoffContractorInternals = toolkit.internals;
