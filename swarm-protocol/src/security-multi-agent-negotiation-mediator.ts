import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_multi_agent_negotiation_mediator',
    collectionField: 'negotiations',
    idField: 'negotiationId',
    defaultName: 'Security Negotiation',
    readyPosture: 'security_negotiation_mediation_ready',
    defaultAgentId: 'agent:security-negotiation',
    recommendationTypes: {
        primary: 'mediate_security_multi_agent_negotiation',
        guard: 'mitigate_security_negotiation_deadlock',
        audit: 'audit_security_negotiation_signals',
        publish: 'publish_security_negotiation_status'
    },
    recommendationTargetMap: {
        mediate_security_multi_agent_negotiation: 'agent:security',
        mitigate_security_negotiation_deadlock: 'agent:policy',
        audit_security_negotiation_signals: 'agent:trust',
        publish_security_negotiation_status: 'agent:ops'
    }
});

export function mediateSecurityMultiAgentNegotiation(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityMultiAgentNegotiationMediatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityMultiAgentNegotiationMediator extends BaseManager {}

export const __securityMultiAgentNegotiationMediatorInternals = toolkit.internals;
