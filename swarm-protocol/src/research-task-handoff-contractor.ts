import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_task_handoff_contractor',
    collectionField: 'handoffs',
    idField: 'handoffId',
    defaultName: 'Research Handoff',
    readyPosture: 'research_handoff_contract_ready',
    defaultAgentId: 'agent:research-handoff',
    recommendationTypes: {
        primary: 'contract_research_task_handoff',
        guard: 'mitigate_research_handoff_mismatch',
        audit: 'audit_research_handoff_signals',
        publish: 'publish_research_handoff_status'
    },
    recommendationTargetMap: {
        contract_research_task_handoff: 'agent:workflow',
        mitigate_research_handoff_mismatch: 'agent:research',
        audit_research_handoff_signals: 'agent:trust',
        publish_research_handoff_status: 'agent:ops'
    }
});

export function contractResearchTaskHandoffs(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchTaskHandoffContractorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchTaskHandoffContractor extends BaseManager {}

export const __researchTaskHandoffContractorInternals = toolkit.internals;
