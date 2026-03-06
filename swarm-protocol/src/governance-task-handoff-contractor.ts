import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_task_handoff_contractor',
    collectionField: 'handoffs',
    idField: 'handoffId',
    defaultName: 'Governance Handoff',
    readyPosture: 'governance_handoff_contract_ready',
    defaultAgentId: 'agent:governance-handoff',
    recommendationTypes: {
        primary: 'contract_governance_task_handoff',
        guard: 'mitigate_governance_handoff_mismatch',
        audit: 'audit_governance_handoff_signals',
        publish: 'publish_governance_handoff_status'
    },
    recommendationTargetMap: {
        contract_governance_task_handoff: 'agent:workflow',
        mitigate_governance_handoff_mismatch: 'agent:governance',
        audit_governance_handoff_signals: 'agent:trust',
        publish_governance_handoff_status: 'agent:ops'
    }
});

export function contractGovernanceTaskHandoffs(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceTaskHandoffContractorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceTaskHandoffContractor extends BaseManager {}

export const __governanceTaskHandoffContractorInternals = toolkit.internals;
