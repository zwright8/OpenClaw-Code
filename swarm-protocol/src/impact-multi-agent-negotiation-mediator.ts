import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_multi_agent_negotiation_mediator',
    collectionField: 'negotiations',
    idField: 'negotiationId',
    defaultName: 'Impact Negotiation',
    readyPosture: 'impact_negotiation_mediation_ready',
    defaultAgentId: 'agent:impact-negotiation',
    recommendationTypes: {
        primary: 'mediate_impact_multi_agent_negotiation',
        guard: 'mitigate_impact_negotiation_deadlock',
        audit: 'audit_impact_negotiation_signals',
        publish: 'publish_impact_negotiation_status'
    },
    recommendationTargetMap: {
        mediate_impact_multi_agent_negotiation: 'agent:impact',
        mitigate_impact_negotiation_deadlock: 'agent:policy',
        audit_impact_negotiation_signals: 'agent:trust',
        publish_impact_negotiation_status: 'agent:ops'
    }
});

export function mediateImpactMultiAgentNegotiation(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactMultiAgentNegotiationMediatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactMultiAgentNegotiationMediator extends BaseManager {}

export const __impactMultiAgentNegotiationMediatorInternals = toolkit.internals;
