import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_multi_agent_negotiation_mediator',
    collectionField: 'negotiations',
    idField: 'negotiationId',
    defaultName: 'Logistics Negotiation',
    readyPosture: 'logistics_negotiation_mediation_ready',
    defaultAgentId: 'agent:logistics-negotiation',
    recommendationTypes: {
        primary: 'mediate_logistics_multi_agent_negotiation',
        guard: 'mitigate_logistics_negotiation_deadlock',
        audit: 'audit_logistics_negotiation_signals',
        publish: 'publish_logistics_negotiation_status'
    },
    recommendationTargetMap: {
        mediate_logistics_multi_agent_negotiation: 'agent:logistics',
        mitigate_logistics_negotiation_deadlock: 'agent:policy',
        audit_logistics_negotiation_signals: 'agent:trust',
        publish_logistics_negotiation_status: 'agent:ops'
    }
});

export function mediateLogisticsMultiAgentNegotiation(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsMultiAgentNegotiationMediatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsMultiAgentNegotiationMediator extends BaseManager {}

export const __logisticsMultiAgentNegotiationMediatorInternals = toolkit.internals;
