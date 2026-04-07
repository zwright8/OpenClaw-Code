import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_community_feedback_harvester',
    collectionField: 'feedbackEntries',
    idField: 'entryId',
    defaultName: 'Research Feedback Entry',
    readyPosture: 'research_community_feedback_harvest_ready',
    defaultAgentId: 'agent:research-feedback-harvester',
    recommendationTypes: {
        primary: 'harvest_research_community_feedback',
        guard: 'mitigate_research_unaddressed_feedback_risk',
        audit: 'audit_research_feedback_harvest_signals',
        publish: 'publish_research_feedback_harvest_status'
    },
    recommendationTargetMap: {
        harvest_research_community_feedback: 'agent:community',
        mitigate_research_unaddressed_feedback_risk: 'agent:product',
        audit_research_feedback_harvest_signals: 'agent:trust',
        publish_research_feedback_harvest_status: 'agent:ops'
    }
});

export function harvestResearchCommunityFeedback(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchCommunityFeedbackHarvesterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchCommunityFeedbackHarvester extends BaseManager {}

export const __researchCommunityFeedbackHarvesterInternals = toolkit.internals;
