import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'tooling_multi_agent_negotiation_mediator',
    collectionField: 'negotiations',
    idField: 'negotiationId',
    defaultName: 'Negotiation',
    readyPosture: 'negotiation_mediation_ready',
    defaultAgentId: 'agent:tooling-negotiation-mediator',
    recommendationTypes: {
        primary: 'mediate_multi_agent_negotiation',
        guard: 'mitigate_negotiation_deadlock_risk',
        audit: 'audit_negotiation_mediation_signals',
        publish: 'publish_negotiation_mediation_status'
    },
    recommendationTargetMap: {
        mediate_multi_agent_negotiation: 'agent:coordination',
        mitigate_negotiation_deadlock_risk: 'agent:governance',
        audit_negotiation_mediation_signals: 'agent:trust',
        publish_negotiation_mediation_status: 'agent:ops'
    }
});

export function mediateToolingMultiAgentNegotiation(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function toolingMultiAgentNegotiationMediatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ToolingMultiAgentNegotiationMediator extends BaseManager {}

export const __toolingMultiAgentNegotiationMediatorInternals = toolkit.internals;
