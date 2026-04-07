import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_multi_agent_negotiation_mediator',
    collectionField: 'negotiations',
    idField: 'negotiationId',
    defaultName: 'Cultural Negotiation',
    readyPosture: 'cultural_negotiation_mediation_ready',
    defaultAgentId: 'agent:cultural-negotiation',
    recommendationTypes: {
        primary: 'mediate_cultural_multi_agent_negotiation',
        guard: 'mitigate_cultural_negotiation_deadlock',
        audit: 'audit_cultural_negotiation_signals',
        publish: 'publish_cultural_negotiation_status'
    },
    recommendationTargetMap: {
        mediate_cultural_multi_agent_negotiation: 'agent:cultural',
        mitigate_cultural_negotiation_deadlock: 'agent:policy',
        audit_cultural_negotiation_signals: 'agent:trust',
        publish_cultural_negotiation_status: 'agent:ops'
    }
});

export function mediateCulturalMultiAgentNegotiation(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalMultiAgentNegotiationMediatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalMultiAgentNegotiationMediator extends BaseManager {}

export const __culturalMultiAgentNegotiationMediatorInternals = toolkit.internals;
