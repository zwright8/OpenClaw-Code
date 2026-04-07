import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_multi_agent_negotiation_mediator',
    collectionField: 'negotiations',
    idField: 'negotiationId',
    defaultName: 'Evolution Negotiation',
    readyPosture: 'evolution_negotiation_mediation_ready',
    defaultAgentId: 'agent:evolution-negotiation',
    recommendationTypes: {
        primary: 'mediate_evolution_multi_agent_negotiation',
        guard: 'mitigate_evolution_negotiation_deadlock',
        audit: 'audit_evolution_negotiation_signals',
        publish: 'publish_evolution_negotiation_status'
    },
    recommendationTargetMap: {
        mediate_evolution_multi_agent_negotiation: 'agent:evolution',
        mitigate_evolution_negotiation_deadlock: 'agent:policy',
        audit_evolution_negotiation_signals: 'agent:trust',
        publish_evolution_negotiation_status: 'agent:ops'
    }
});

export function mediateEvolutionMultiAgentNegotiation(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionMultiAgentNegotiationMediatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionMultiAgentNegotiationMediator extends BaseManager {}

export const __evolutionMultiAgentNegotiationMediatorInternals = toolkit.internals;
