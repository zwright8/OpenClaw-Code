import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_community_feedback_harvester',
    collectionField: 'feedbackEntries',
    idField: 'entryId',
    defaultName: 'Community Feedback Entry',
    readyPosture: 'community_feedback_harvest_ready',
    defaultAgentId: 'agent:community-feedback-harvester',
    recommendationTypes: {
        primary: 'harvest_community_community_feedback',
        guard: 'mitigate_community_unaddressed_feedback_risk',
        audit: 'audit_community_feedback_harvest_signals',
        publish: 'publish_community_feedback_harvest_status'
    },
    recommendationTargetMap: {
        harvest_community_community_feedback: 'agent:community',
        mitigate_community_unaddressed_feedback_risk: 'agent:product',
        audit_community_feedback_harvest_signals: 'agent:trust',
        publish_community_feedback_harvest_status: 'agent:ops'
    }
});

export function harvestCommunityCommunityFeedback(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityCommunityFeedbackHarvesterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityCommunityFeedbackHarvester extends BaseManager {}

export const __communityCommunityFeedbackHarvesterInternals = toolkit.internals;
