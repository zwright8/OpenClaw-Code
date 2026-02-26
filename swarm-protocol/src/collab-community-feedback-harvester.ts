import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_community_feedback_harvester',
    collectionField: 'feedbackEntries',
    idField: 'entryId',
    defaultName: 'Collab Feedback Entry',
    readyPosture: 'collab_community_feedback_harvest_ready',
    defaultAgentId: 'agent:collab-feedback-harvester',
    recommendationTypes: {
        primary: 'harvest_collab_community_feedback',
        guard: 'mitigate_collab_unaddressed_feedback_risk',
        audit: 'audit_collab_feedback_harvest_signals',
        publish: 'publish_collab_feedback_harvest_status'
    },
    recommendationTargetMap: {
        harvest_collab_community_feedback: 'agent:community',
        mitigate_collab_unaddressed_feedback_risk: 'agent:product',
        audit_collab_feedback_harvest_signals: 'agent:trust',
        publish_collab_feedback_harvest_status: 'agent:ops'
    }
});

export function harvestCollabCommunityFeedback(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabCommunityFeedbackHarvesterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabCommunityFeedbackHarvester extends BaseManager {}

export const __collabCommunityFeedbackHarvesterInternals = toolkit.internals;
