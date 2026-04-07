import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_community_feedback_harvester',
    collectionField: 'feedbackEntries',
    idField: 'entryId',
    defaultName: 'Cultural Feedback Entry',
    readyPosture: 'cultural_community_feedback_harvest_ready',
    defaultAgentId: 'agent:cultural-feedback-harvester',
    recommendationTypes: {
        primary: 'harvest_cultural_community_feedback',
        guard: 'mitigate_cultural_unaddressed_feedback_risk',
        audit: 'audit_cultural_feedback_harvest_signals',
        publish: 'publish_cultural_feedback_harvest_status'
    },
    recommendationTargetMap: {
        harvest_cultural_community_feedback: 'agent:community',
        mitigate_cultural_unaddressed_feedback_risk: 'agent:product',
        audit_cultural_feedback_harvest_signals: 'agent:trust',
        publish_cultural_feedback_harvest_status: 'agent:ops'
    }
});

export function harvestCulturalCommunityFeedback(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalCommunityFeedbackHarvesterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalCommunityFeedbackHarvester extends BaseManager {}

export const __culturalCommunityFeedbackHarvesterInternals = toolkit.internals;
