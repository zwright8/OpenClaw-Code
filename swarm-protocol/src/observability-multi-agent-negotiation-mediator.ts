import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_multi_agent_negotiation_mediator',
    collectionField: 'negotiations',
    idField: 'negotiationId',
    defaultName: 'Observability Negotiation',
    readyPosture: 'observability_negotiation_mediation_ready',
    defaultAgentId: 'agent:observability-negotiation',
    recommendationTypes: {
        primary: 'mediate_observability_multi_agent_negotiation',
        guard: 'mitigate_observability_negotiation_deadlock',
        audit: 'audit_observability_negotiation_signals',
        publish: 'publish_observability_negotiation_status'
    },
    recommendationTargetMap: {
        mediate_observability_multi_agent_negotiation: 'agent:observability',
        mitigate_observability_negotiation_deadlock: 'agent:policy',
        audit_observability_negotiation_signals: 'agent:trust',
        publish_observability_negotiation_status: 'agent:ops'
    }
});

export function mediateObservabilityMultiAgentNegotiation(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityMultiAgentNegotiationMediatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityMultiAgentNegotiationMediator extends BaseManager {}

export const __observabilityMultiAgentNegotiationMediatorInternals = toolkit.internals;
