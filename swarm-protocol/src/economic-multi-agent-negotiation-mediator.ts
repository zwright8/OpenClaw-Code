import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_multi_agent_negotiation_mediator',
    collectionField: 'negotiations',
    idField: 'negotiationId',
    defaultName: 'Economic Negotiation',
    readyPosture: 'economic_negotiation_mediation_ready',
    defaultAgentId: 'agent:economic-negotiation',
    recommendationTypes: {
        primary: 'mediate_economic_multi_agent_negotiation',
        guard: 'mitigate_economic_negotiation_deadlock',
        audit: 'audit_economic_negotiation_signals',
        publish: 'publish_economic_negotiation_status'
    },
    recommendationTargetMap: {
        mediate_economic_multi_agent_negotiation: 'agent:economic',
        mitigate_economic_negotiation_deadlock: 'agent:policy',
        audit_economic_negotiation_signals: 'agent:trust',
        publish_economic_negotiation_status: 'agent:ops'
    }
});

export function mediateEconomicMultiAgentNegotiation(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicMultiAgentNegotiationMediatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicMultiAgentNegotiationMediator extends BaseManager {}

export const __economicMultiAgentNegotiationMediatorInternals = toolkit.internals;
