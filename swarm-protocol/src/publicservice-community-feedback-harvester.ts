import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_community_feedback_harvester',
    collectionField: 'feedbackEntries',
    idField: 'entryId',
    defaultName: 'PublicService Feedback Entry',
    readyPosture: 'publicservice_community_feedback_harvest_ready',
    defaultAgentId: 'agent:publicservice-feedback-harvester',
    recommendationTypes: {
        primary: 'harvest_publicservice_community_feedback',
        guard: 'mitigate_publicservice_unaddressed_feedback_risk',
        audit: 'audit_publicservice_feedback_harvest_signals',
        publish: 'publish_publicservice_feedback_harvest_status'
    },
    recommendationTargetMap: {
        harvest_publicservice_community_feedback: 'agent:community',
        mitigate_publicservice_unaddressed_feedback_risk: 'agent:product',
        audit_publicservice_feedback_harvest_signals: 'agent:trust',
        publish_publicservice_feedback_harvest_status: 'agent:ops'
    }
});

export function harvestPublicServiceCommunityFeedback(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceCommunityFeedbackHarvesterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceCommunityFeedbackHarvester extends BaseManager {}

export const __publicServiceCommunityFeedbackHarvesterInternals = toolkit.internals;
