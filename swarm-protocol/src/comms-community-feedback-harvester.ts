import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_community_feedback_harvester',
    collectionField: 'feedbackEntries',
    idField: 'entryId',
    defaultName: 'Comms Feedback Entry',
    readyPosture: 'comms_community_feedback_harvest_ready',
    defaultAgentId: 'agent:comms-feedback-harvester',
    recommendationTypes: {
        primary: 'harvest_comms_community_feedback',
        guard: 'mitigate_comms_unaddressed_feedback_risk',
        audit: 'audit_comms_feedback_harvest_signals',
        publish: 'publish_comms_feedback_harvest_status'
    },
    recommendationTargetMap: {
        harvest_comms_community_feedback: 'agent:community',
        mitigate_comms_unaddressed_feedback_risk: 'agent:product',
        audit_comms_feedback_harvest_signals: 'agent:trust',
        publish_comms_feedback_harvest_status: 'agent:ops'
    }
});

export function harvestCommsCommunityFeedback(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsCommunityFeedbackHarvesterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsCommunityFeedbackHarvester extends BaseManager {}

export const __commsCommunityFeedbackHarvesterInternals = toolkit.internals;
