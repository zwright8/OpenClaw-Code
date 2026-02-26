import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_community_feedback_harvester',
    collectionField: 'feedbackEntries',
    idField: 'entryId',
    defaultName: 'Impact Feedback Entry',
    readyPosture: 'impact_community_feedback_harvest_ready',
    defaultAgentId: 'agent:impact-feedback-harvester',
    recommendationTypes: {
        primary: 'harvest_impact_community_feedback',
        guard: 'mitigate_impact_unaddressed_feedback_risk',
        audit: 'audit_impact_feedback_harvest_signals',
        publish: 'publish_impact_feedback_harvest_status'
    },
    recommendationTargetMap: {
        harvest_impact_community_feedback: 'agent:community',
        mitigate_impact_unaddressed_feedback_risk: 'agent:product',
        audit_impact_feedback_harvest_signals: 'agent:trust',
        publish_impact_feedback_harvest_status: 'agent:ops'
    }
});

export function harvestImpactCommunityFeedback(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactCommunityFeedbackHarvesterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactCommunityFeedbackHarvester extends BaseManager {}

export const __impactCommunityFeedbackHarvesterInternals = toolkit.internals;
