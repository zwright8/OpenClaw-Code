import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_multi_agent_negotiation_mediator',
    collectionField: 'negotiations',
    idField: 'negotiationId',
    defaultName: 'Engineering Negotiation',
    readyPosture: 'engineering_negotiation_mediation_ready',
    defaultAgentId: 'agent:engineering-negotiation',
    recommendationTypes: {
        primary: 'mediate_engineering_multi_agent_negotiation',
        guard: 'mitigate_engineering_negotiation_deadlock',
        audit: 'audit_engineering_negotiation_signals',
        publish: 'publish_engineering_negotiation_status'
    },
    recommendationTargetMap: {
        mediate_engineering_multi_agent_negotiation: 'agent:engineering',
        mitigate_engineering_negotiation_deadlock: 'agent:policy',
        audit_engineering_negotiation_signals: 'agent:trust',
        publish_engineering_negotiation_status: 'agent:ops'
    }
});

export function mediateEngineeringMultiAgentNegotiation(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringMultiAgentNegotiationMediatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringMultiAgentNegotiationMediator extends BaseManager {}

export const __engineeringMultiAgentNegotiationMediatorInternals = toolkit.internals;
