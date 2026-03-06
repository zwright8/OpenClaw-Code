import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_community_feedback_harvester',
    collectionField: 'feedbackEntries',
    idField: 'entryId',
    defaultName: 'Logistics Feedback Entry',
    readyPosture: 'logistics_community_feedback_harvest_ready',
    defaultAgentId: 'agent:logistics-feedback-harvester',
    recommendationTypes: {
        primary: 'harvest_logistics_community_feedback',
        guard: 'mitigate_logistics_unaddressed_feedback_risk',
        audit: 'audit_logistics_feedback_harvest_signals',
        publish: 'publish_logistics_feedback_harvest_status'
    },
    recommendationTargetMap: {
        harvest_logistics_community_feedback: 'agent:community',
        mitigate_logistics_unaddressed_feedback_risk: 'agent:product',
        audit_logistics_feedback_harvest_signals: 'agent:trust',
        publish_logistics_feedback_harvest_status: 'agent:ops'
    }
});

export function harvestLogisticsCommunityFeedback(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsCommunityFeedbackHarvesterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsCommunityFeedbackHarvester extends BaseManager {}

export const __logisticsCommunityFeedbackHarvesterInternals = toolkit.internals;
