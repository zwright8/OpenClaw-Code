import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_multi_agent_negotiation_mediator',
    collectionField: 'negotiations',
    idField: 'negotiationId',
    defaultName: 'Oversight Negotiation',
    readyPosture: 'oversight_negotiation_mediation_ready',
    defaultAgentId: 'agent:oversight-negotiation',
    recommendationTypes: {
        primary: 'mediate_oversight_multi_agent_negotiation',
        guard: 'mitigate_oversight_negotiation_deadlock',
        audit: 'audit_oversight_negotiation_signals',
        publish: 'publish_oversight_negotiation_status'
    },
    recommendationTargetMap: {
        mediate_oversight_multi_agent_negotiation: 'agent:oversight',
        mitigate_oversight_negotiation_deadlock: 'agent:policy',
        audit_oversight_negotiation_signals: 'agent:trust',
        publish_oversight_negotiation_status: 'agent:ops'
    }
});

export function mediateOversightMultiAgentNegotiation(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightMultiAgentNegotiationMediatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightMultiAgentNegotiationMediator extends BaseManager {}

export const __oversightMultiAgentNegotiationMediatorInternals = toolkit.internals;
