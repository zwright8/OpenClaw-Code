import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_uncertainty_communicator',
    collectionField: 'briefings',
    idField: 'briefingId',
    defaultName: 'Research Briefing',
    readyPosture: 'research_uncertainty_communication_ready',
    defaultAgentId: 'agent:research-uncertainty',
    recommendationTypes: {
        primary: 'communicate_research_uncertainty',
        guard: 'mitigate_research_overconfidence_risk',
        audit: 'audit_research_uncertainty_signals',
        publish: 'publish_research_uncertainty_status'
    },
    recommendationTargetMap: {
        communicate_research_uncertainty: 'agent:research',
        mitigate_research_overconfidence_risk: 'agent:risk',
        audit_research_uncertainty_signals: 'agent:trust',
        publish_research_uncertainty_status: 'agent:ops'
    }
});

export function communicateResearchUncertainty(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchUncertaintyCommunicatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchUncertaintyCommunicator extends BaseManager {}

export const __researchUncertaintyCommunicatorInternals = toolkit.internals;
