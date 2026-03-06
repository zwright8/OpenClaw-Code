import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_multi_agent_negotiation_mediator',
    collectionField: 'negotiations',
    idField: 'negotiationId',
    defaultName: 'Comms Negotiation',
    readyPosture: 'comms_negotiation_mediation_ready',
    defaultAgentId: 'agent:comms-negotiation',
    recommendationTypes: {
        primary: 'mediate_comms_multi_agent_negotiation',
        guard: 'mitigate_comms_negotiation_deadlock',
        audit: 'audit_comms_negotiation_signals',
        publish: 'publish_comms_negotiation_status'
    },
    recommendationTargetMap: {
        mediate_comms_multi_agent_negotiation: 'agent:comms',
        mitigate_comms_negotiation_deadlock: 'agent:policy',
        audit_comms_negotiation_signals: 'agent:trust',
        publish_comms_negotiation_status: 'agent:ops'
    }
});

export function mediateCommsMultiAgentNegotiation(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsMultiAgentNegotiationMediatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsMultiAgentNegotiationMediator extends BaseManager {}

export const __commsMultiAgentNegotiationMediatorInternals = toolkit.internals;
