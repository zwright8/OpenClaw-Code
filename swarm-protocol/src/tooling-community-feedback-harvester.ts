import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'tooling_community_feedback_harvester',
    collectionField: 'feedbackEntries',
    idField: 'entryId',
    defaultName: 'Feedback Entry',
    readyPosture: 'community_feedback_harvest_ready',
    defaultAgentId: 'agent:tooling-feedback-harvester',
    recommendationTypes: {
        primary: 'harvest_tooling_community_feedback',
        guard: 'mitigate_unaddressed_feedback_risk',
        audit: 'audit_feedback_harvest_signals',
        publish: 'publish_feedback_harvest_status'
    },
    recommendationTargetMap: {
        harvest_tooling_community_feedback: 'agent:community',
        mitigate_unaddressed_feedback_risk: 'agent:product',
        audit_feedback_harvest_signals: 'agent:trust',
        publish_feedback_harvest_status: 'agent:ops'
    }
});

export function harvestToolingCommunityFeedback(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function toolingCommunityFeedbackHarvesterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ToolingCommunityFeedbackHarvester extends BaseManager {}

export const __toolingCommunityFeedbackHarvesterInternals = toolkit.internals;
