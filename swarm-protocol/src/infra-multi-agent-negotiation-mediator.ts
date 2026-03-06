import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_multi_agent_negotiation_mediator',
    collectionField: 'negotiations',
    idField: 'negotiationId',
    defaultName: 'Infra Negotiation',
    readyPosture: 'infra_negotiation_mediation_ready',
    defaultAgentId: 'agent:infra-negotiation',
    recommendationTypes: {
        primary: 'mediate_infra_multi_agent_negotiation',
        guard: 'mitigate_infra_negotiation_deadlock',
        audit: 'audit_infra_negotiation_signals',
        publish: 'publish_infra_negotiation_status'
    },
    recommendationTargetMap: {
        mediate_infra_multi_agent_negotiation: 'agent:infra',
        mitigate_infra_negotiation_deadlock: 'agent:policy',
        audit_infra_negotiation_signals: 'agent:trust',
        publish_infra_negotiation_status: 'agent:ops'
    }
});

export function mediateInfraMultiAgentNegotiation(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraMultiAgentNegotiationMediatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraMultiAgentNegotiationMediator extends BaseManager {}

export const __infraMultiAgentNegotiationMediatorInternals = toolkit.internals;
