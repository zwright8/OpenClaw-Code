import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_community_feedback_harvester',
    collectionField: 'feedbackEntries',
    idField: 'entryId',
    defaultName: 'Crisis Feedback Entry',
    readyPosture: 'crisis_community_feedback_harvest_ready',
    defaultAgentId: 'agent:crisis-feedback-harvester',
    recommendationTypes: {
        primary: 'harvest_crisis_community_feedback',
        guard: 'mitigate_crisis_unaddressed_feedback_risk',
        audit: 'audit_crisis_feedback_harvest_signals',
        publish: 'publish_crisis_feedback_harvest_status'
    },
    recommendationTargetMap: {
        harvest_crisis_community_feedback: 'agent:community',
        mitigate_crisis_unaddressed_feedback_risk: 'agent:product',
        audit_crisis_feedback_harvest_signals: 'agent:trust',
        publish_crisis_feedback_harvest_status: 'agent:ops'
    }
});

export function harvestCrisisCommunityFeedback(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisCommunityFeedbackHarvesterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisCommunityFeedbackHarvester extends BaseManager {}

export const __crisisCommunityFeedbackHarvesterInternals = toolkit.internals;
