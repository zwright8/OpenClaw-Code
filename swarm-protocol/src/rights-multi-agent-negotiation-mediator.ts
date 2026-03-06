import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_multi_agent_negotiation_mediator',
    collectionField: 'negotiations',
    idField: 'negotiationId',
    defaultName: 'Rights Negotiation',
    readyPosture: 'rights_negotiation_mediation_ready',
    defaultAgentId: 'agent:rights-negotiation',
    recommendationTypes: {
        primary: 'mediate_rights_multi_agent_negotiation',
        guard: 'mitigate_rights_negotiation_deadlock',
        audit: 'audit_rights_negotiation_signals',
        publish: 'publish_rights_negotiation_status'
    },
    recommendationTargetMap: {
        mediate_rights_multi_agent_negotiation: 'agent:rights',
        mitigate_rights_negotiation_deadlock: 'agent:policy',
        audit_rights_negotiation_signals: 'agent:trust',
        publish_rights_negotiation_status: 'agent:ops'
    }
});

export function mediateRightsMultiAgentNegotiation(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsMultiAgentNegotiationMediatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsMultiAgentNegotiationMediator extends BaseManager {}

export const __rightsMultiAgentNegotiationMediatorInternals = toolkit.internals;
