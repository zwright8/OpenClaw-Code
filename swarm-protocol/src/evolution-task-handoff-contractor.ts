import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_task_handoff_contractor',
    collectionField: 'handoffs',
    idField: 'handoffId',
    defaultName: 'Evolution Handoff',
    readyPosture: 'evolution_handoff_contract_ready',
    defaultAgentId: 'agent:evolution-handoff',
    recommendationTypes: {
        primary: 'contract_evolution_task_handoff',
        guard: 'mitigate_evolution_handoff_mismatch',
        audit: 'audit_evolution_handoff_signals',
        publish: 'publish_evolution_handoff_status'
    },
    recommendationTargetMap: {
        contract_evolution_task_handoff: 'agent:workflow',
        mitigate_evolution_handoff_mismatch: 'agent:evolution',
        audit_evolution_handoff_signals: 'agent:trust',
        publish_evolution_handoff_status: 'agent:ops'
    }
});

export function contractEvolutionTaskHandoffs(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionTaskHandoffContractorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionTaskHandoffContractor extends BaseManager {}

export const __evolutionTaskHandoffContractorInternals = toolkit.internals;
