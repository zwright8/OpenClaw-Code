import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_uncertainty_communicator',
    collectionField: 'briefings',
    idField: 'briefingId',
    defaultName: 'Evolution Briefing',
    readyPosture: 'evolution_uncertainty_calibrated',
    defaultAgentId: 'agent:evolution-uncertainty',
    recommendationTypes: {
        primary: 'communicate_evolution_uncertainty',
        guard: 'mitigate_evolution_overconfidence_bias',
        audit: 'audit_evolution_uncertainty_signals',
        publish: 'publish_evolution_uncertainty_status'
    },
    recommendationTargetMap: {
        communicate_evolution_uncertainty: 'agent:evolution',
        mitigate_evolution_overconfidence_bias: 'agent:policy',
        audit_evolution_uncertainty_signals: 'agent:trust',
        publish_evolution_uncertainty_status: 'agent:ops'
    }
});

export function communicateEvolutionUncertainty(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionUncertaintyCommunicatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionUncertaintyCommunicator extends BaseManager {}

export const __evolutionUncertaintyCommunicatorInternals = toolkit.internals;
