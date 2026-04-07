import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_community_feedback_harvester',
    collectionField: 'feedbackEntries',
    idField: 'entryId',
    defaultName: 'Observability Feedback Entry',
    readyPosture: 'observability_community_feedback_harvest_ready',
    defaultAgentId: 'agent:observability-feedback-harvester',
    recommendationTypes: {
        primary: 'harvest_observability_community_feedback',
        guard: 'mitigate_observability_unaddressed_feedback_risk',
        audit: 'audit_observability_feedback_harvest_signals',
        publish: 'publish_observability_feedback_harvest_status'
    },
    recommendationTargetMap: {
        harvest_observability_community_feedback: 'agent:community',
        mitigate_observability_unaddressed_feedback_risk: 'agent:product',
        audit_observability_feedback_harvest_signals: 'agent:trust',
        publish_observability_feedback_harvest_status: 'agent:ops'
    }
});

export function harvestObservabilityCommunityFeedback(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityCommunityFeedbackHarvesterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityCommunityFeedbackHarvester extends BaseManager {}

export const __observabilityCommunityFeedbackHarvesterInternals = toolkit.internals;
