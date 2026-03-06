import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_community_feedback_harvester',
    collectionField: 'feedbackEntries',
    idField: 'entryId',
    defaultName: 'Inclusion Feedback Entry',
    readyPosture: 'inclusion_community_feedback_harvest_ready',
    defaultAgentId: 'agent:inclusion-feedback-harvester',
    recommendationTypes: {
        primary: 'harvest_inclusion_community_feedback',
        guard: 'mitigate_inclusion_unaddressed_feedback_risk',
        audit: 'audit_inclusion_feedback_harvest_signals',
        publish: 'publish_inclusion_feedback_harvest_status'
    },
    recommendationTargetMap: {
        harvest_inclusion_community_feedback: 'agent:community',
        mitigate_inclusion_unaddressed_feedback_risk: 'agent:product',
        audit_inclusion_feedback_harvest_signals: 'agent:trust',
        publish_inclusion_feedback_harvest_status: 'agent:ops'
    }
});

export function harvestInclusionCommunityFeedback(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionCommunityFeedbackHarvesterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionCommunityFeedbackHarvester extends BaseManager {}

export const __inclusionCommunityFeedbackHarvesterInternals = toolkit.internals;
