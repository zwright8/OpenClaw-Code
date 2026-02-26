import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_community_feedback_harvester',
    collectionField: 'feedbackEntries',
    idField: 'entryId',
    defaultName: 'Federation Feedback Entry',
    readyPosture: 'federation_community_feedback_harvest_ready',
    defaultAgentId: 'agent:federation-feedback-harvester',
    recommendationTypes: {
        primary: 'harvest_federation_community_feedback',
        guard: 'mitigate_federation_unaddressed_feedback_risk',
        audit: 'audit_federation_feedback_harvest_signals',
        publish: 'publish_federation_feedback_harvest_status'
    },
    recommendationTargetMap: {
        harvest_federation_community_feedback: 'agent:community',
        mitigate_federation_unaddressed_feedback_risk: 'agent:product',
        audit_federation_feedback_harvest_signals: 'agent:trust',
        publish_federation_feedback_harvest_status: 'agent:ops'
    }
});

export function harvestFederationCommunityFeedback(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationCommunityFeedbackHarvesterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationCommunityFeedbackHarvester extends BaseManager {}

export const __federationCommunityFeedbackHarvesterInternals = toolkit.internals;
