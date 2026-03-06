import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_task_handoff_contractor',
    collectionField: 'handoffs',
    idField: 'handoffId',
    defaultName: 'Security Handoff',
    readyPosture: 'security_handoff_contract_ready',
    defaultAgentId: 'agent:security-handoff',
    recommendationTypes: {
        primary: 'contract_security_task_handoff',
        guard: 'mitigate_security_handoff_mismatch',
        audit: 'audit_security_handoff_signals',
        publish: 'publish_security_handoff_status'
    },
    recommendationTargetMap: {
        contract_security_task_handoff: 'agent:workflow',
        mitigate_security_handoff_mismatch: 'agent:security',
        audit_security_handoff_signals: 'agent:trust',
        publish_security_handoff_status: 'agent:ops'
    }
});

export function contractSecurityTaskHandoffs(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityTaskHandoffContractorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityTaskHandoffContractor extends BaseManager {}

export const __securityTaskHandoffContractorInternals = toolkit.internals;
