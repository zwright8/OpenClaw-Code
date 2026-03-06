import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_multi_agent_negotiation_mediator',
    collectionField: 'negotiations',
    idField: 'negotiationId',
    defaultName: 'Inclusion Negotiation',
    readyPosture: 'inclusion_negotiation_mediation_ready',
    defaultAgentId: 'agent:inclusion-negotiation',
    recommendationTypes: {
        primary: 'mediate_inclusion_multi_agent_negotiation',
        guard: 'mitigate_inclusion_negotiation_deadlock',
        audit: 'audit_inclusion_negotiation_signals',
        publish: 'publish_inclusion_negotiation_status'
    },
    recommendationTargetMap: {
        mediate_inclusion_multi_agent_negotiation: 'agent:inclusion',
        mitigate_inclusion_negotiation_deadlock: 'agent:policy',
        audit_inclusion_negotiation_signals: 'agent:trust',
        publish_inclusion_negotiation_status: 'agent:ops'
    }
});

export function mediateInclusionMultiAgentNegotiation(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionMultiAgentNegotiationMediatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionMultiAgentNegotiationMediator extends BaseManager {}

export const __inclusionMultiAgentNegotiationMediatorInternals = toolkit.internals;
