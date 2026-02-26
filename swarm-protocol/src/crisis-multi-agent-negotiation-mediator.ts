import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_multi_agent_negotiation_mediator',
    collectionField: 'negotiations',
    idField: 'negotiationId',
    defaultName: 'Crisis Negotiation',
    readyPosture: 'crisis_negotiation_mediation_ready',
    defaultAgentId: 'agent:crisis-negotiation',
    recommendationTypes: {
        primary: 'mediate_crisis_multi_agent_negotiation',
        guard: 'mitigate_crisis_negotiation_deadlock',
        audit: 'audit_crisis_negotiation_signals',
        publish: 'publish_crisis_negotiation_status'
    },
    recommendationTargetMap: {
        mediate_crisis_multi_agent_negotiation: 'agent:crisis',
        mitigate_crisis_negotiation_deadlock: 'agent:policy',
        audit_crisis_negotiation_signals: 'agent:trust',
        publish_crisis_negotiation_status: 'agent:ops'
    }
});

export function mediateCrisisMultiAgentNegotiation(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisMultiAgentNegotiationMediatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisMultiAgentNegotiationMediator extends BaseManager {}

export const __crisisMultiAgentNegotiationMediatorInternals = toolkit.internals;
