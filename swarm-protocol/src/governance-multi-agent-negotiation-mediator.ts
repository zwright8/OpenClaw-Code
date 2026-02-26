import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_multi_agent_negotiation_mediator',
    collectionField: 'negotiations',
    idField: 'negotiationId',
    defaultName: 'Governance Negotiation',
    readyPosture: 'governance_negotiation_mediation_ready',
    defaultAgentId: 'agent:governance-negotiation',
    recommendationTypes: {
        primary: 'mediate_governance_multi_agent_negotiation',
        guard: 'mitigate_governance_negotiation_deadlock',
        audit: 'audit_governance_negotiation_signals',
        publish: 'publish_governance_negotiation_status'
    },
    recommendationTargetMap: {
        mediate_governance_multi_agent_negotiation: 'agent:governance',
        mitigate_governance_negotiation_deadlock: 'agent:policy',
        audit_governance_negotiation_signals: 'agent:trust',
        publish_governance_negotiation_status: 'agent:ops'
    }
});

export function mediateGovernanceMultiAgentNegotiation(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceMultiAgentNegotiationMediatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceMultiAgentNegotiationMediator extends BaseManager {}

export const __governanceMultiAgentNegotiationMediatorInternals = toolkit.internals;
