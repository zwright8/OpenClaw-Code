import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_task_handoff_contractor',
    collectionField: 'handoffs',
    idField: 'handoffId',
    defaultName: 'Education Handoff',
    readyPosture: 'education_handoff_contract_ready',
    defaultAgentId: 'agent:education-handoff',
    recommendationTypes: {
        primary: 'contract_education_task_handoff',
        guard: 'mitigate_education_handoff_mismatch',
        audit: 'audit_education_handoff_signals',
        publish: 'publish_education_handoff_status'
    },
    recommendationTargetMap: {
        contract_education_task_handoff: 'agent:workflow',
        mitigate_education_handoff_mismatch: 'agent:education',
        audit_education_handoff_signals: 'agent:trust',
        publish_education_handoff_status: 'agent:ops'
    }
});

export function contractEducationTaskHandoffs(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationTaskHandoffContractorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationTaskHandoffContractor extends BaseManager {}

export const __educationTaskHandoffContractorInternals = toolkit.internals;
