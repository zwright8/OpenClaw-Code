import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_community_feedback_harvester',
    collectionField: 'feedbackEntries',
    idField: 'entryId',
    defaultName: 'Education Feedback Entry',
    readyPosture: 'education_community_feedback_harvest_ready',
    defaultAgentId: 'agent:education-feedback-harvester',
    recommendationTypes: {
        primary: 'harvest_education_community_feedback',
        guard: 'mitigate_education_unaddressed_feedback_risk',
        audit: 'audit_education_feedback_harvest_signals',
        publish: 'publish_education_feedback_harvest_status'
    },
    recommendationTargetMap: {
        harvest_education_community_feedback: 'agent:community',
        mitigate_education_unaddressed_feedback_risk: 'agent:product',
        audit_education_feedback_harvest_signals: 'agent:trust',
        publish_education_feedback_harvest_status: 'agent:ops'
    }
});

export function harvestEducationCommunityFeedback(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationCommunityFeedbackHarvesterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationCommunityFeedbackHarvester extends BaseManager {}

export const __educationCommunityFeedbackHarvesterInternals = toolkit.internals;
