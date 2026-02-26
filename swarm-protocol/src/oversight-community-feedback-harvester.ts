import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_community_feedback_harvester',
    collectionField: 'feedbackEntries',
    idField: 'entryId',
    defaultName: 'Oversight Feedback Entry',
    readyPosture: 'oversight_community_feedback_harvest_ready',
    defaultAgentId: 'agent:oversight-feedback-harvester',
    recommendationTypes: {
        primary: 'harvest_oversight_community_feedback',
        guard: 'mitigate_oversight_unaddressed_feedback_risk',
        audit: 'audit_oversight_feedback_harvest_signals',
        publish: 'publish_oversight_feedback_harvest_status'
    },
    recommendationTargetMap: {
        harvest_oversight_community_feedback: 'agent:community',
        mitigate_oversight_unaddressed_feedback_risk: 'agent:product',
        audit_oversight_feedback_harvest_signals: 'agent:trust',
        publish_oversight_feedback_harvest_status: 'agent:ops'
    }
});

export function harvestOversightCommunityFeedback(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightCommunityFeedbackHarvesterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightCommunityFeedbackHarvester extends BaseManager {}

export const __oversightCommunityFeedbackHarvesterInternals = toolkit.internals;
