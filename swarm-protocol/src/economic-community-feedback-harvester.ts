import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_community_feedback_harvester',
    collectionField: 'feedbackEntries',
    idField: 'entryId',
    defaultName: 'Economic Feedback Entry',
    readyPosture: 'economic_community_feedback_harvest_ready',
    defaultAgentId: 'agent:economic-feedback-harvester',
    recommendationTypes: {
        primary: 'harvest_economic_community_feedback',
        guard: 'mitigate_economic_unaddressed_feedback_risk',
        audit: 'audit_economic_feedback_harvest_signals',
        publish: 'publish_economic_feedback_harvest_status'
    },
    recommendationTargetMap: {
        harvest_economic_community_feedback: 'agent:community',
        mitigate_economic_unaddressed_feedback_risk: 'agent:product',
        audit_economic_feedback_harvest_signals: 'agent:trust',
        publish_economic_feedback_harvest_status: 'agent:ops'
    }
});

export function harvestEconomicCommunityFeedback(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicCommunityFeedbackHarvesterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicCommunityFeedbackHarvester extends BaseManager {}

export const __economicCommunityFeedbackHarvesterInternals = toolkit.internals;
