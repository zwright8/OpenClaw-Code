import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_multi_agent_negotiation_mediator',
    collectionField: 'negotiations',
    idField: 'negotiationId',
    defaultName: 'Education Negotiation',
    readyPosture: 'education_negotiation_mediation_ready',
    defaultAgentId: 'agent:education-negotiation',
    recommendationTypes: {
        primary: 'mediate_education_multi_agent_negotiation',
        guard: 'mitigate_education_negotiation_deadlock',
        audit: 'audit_education_negotiation_signals',
        publish: 'publish_education_negotiation_status'
    },
    recommendationTargetMap: {
        mediate_education_multi_agent_negotiation: 'agent:education',
        mitigate_education_negotiation_deadlock: 'agent:policy',
        audit_education_negotiation_signals: 'agent:trust',
        publish_education_negotiation_status: 'agent:ops'
    }
});

export function mediateEducationMultiAgentNegotiation(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationMultiAgentNegotiationMediatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationMultiAgentNegotiationMediator extends BaseManager {}

export const __educationMultiAgentNegotiationMediatorInternals = toolkit.internals;
