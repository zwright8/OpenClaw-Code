import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_community_feedback_harvester',
    collectionField: 'feedbackEntries',
    idField: 'entryId',
    defaultName: 'Engineering Feedback Entry',
    readyPosture: 'engineering_community_feedback_harvest_ready',
    defaultAgentId: 'agent:engineering-feedback-harvester',
    recommendationTypes: {
        primary: 'harvest_engineering_community_feedback',
        guard: 'mitigate_engineering_unaddressed_feedback_risk',
        audit: 'audit_engineering_feedback_harvest_signals',
        publish: 'publish_engineering_feedback_harvest_status'
    },
    recommendationTargetMap: {
        harvest_engineering_community_feedback: 'agent:community',
        mitigate_engineering_unaddressed_feedback_risk: 'agent:product',
        audit_engineering_feedback_harvest_signals: 'agent:trust',
        publish_engineering_feedback_harvest_status: 'agent:ops'
    }
});

export function harvestEngineeringCommunityFeedback(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringCommunityFeedbackHarvesterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringCommunityFeedbackHarvester extends BaseManager {}

export const __engineeringCommunityFeedbackHarvesterInternals = toolkit.internals;
