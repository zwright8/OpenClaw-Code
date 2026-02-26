import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_task_handoff_contractor',
    collectionField: 'handoffs',
    idField: 'handoffId',
    defaultName: 'Impact Handoff',
    readyPosture: 'impact_handoff_contract_ready',
    defaultAgentId: 'agent:impact-handoff',
    recommendationTypes: {
        primary: 'contract_impact_task_handoff',
        guard: 'mitigate_impact_handoff_mismatch',
        audit: 'audit_impact_handoff_signals',
        publish: 'publish_impact_handoff_status'
    },
    recommendationTargetMap: {
        contract_impact_task_handoff: 'agent:workflow',
        mitigate_impact_handoff_mismatch: 'agent:impact',
        audit_impact_handoff_signals: 'agent:trust',
        publish_impact_handoff_status: 'agent:ops'
    }
});

export function contractImpactTaskHandoffs(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactTaskHandoffContractorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactTaskHandoffContractor extends BaseManager {}

export const __impactTaskHandoffContractorInternals = toolkit.internals;
