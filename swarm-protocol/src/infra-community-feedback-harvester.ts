import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_community_feedback_harvester',
    collectionField: 'feedbackEntries',
    idField: 'entryId',
    defaultName: 'Infra Feedback Entry',
    readyPosture: 'infra_feedback_harvested',
    defaultAgentId: 'agent:infra-feedback',
    recommendationTypes: {
        primary: 'harvest_infra_community_feedback',
        guard: 'mitigate_infra_feedback_blindspots',
        audit: 'audit_infra_feedback_signals',
        publish: 'publish_infra_feedback_status'
    },
    recommendationTargetMap: {
        harvest_infra_community_feedback: 'agent:infra',
        mitigate_infra_feedback_blindspots: 'agent:community',
        audit_infra_feedback_signals: 'agent:trust',
        publish_infra_feedback_status: 'agent:ops'
    }
});

export function harvestInfraCommunityFeedback(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraCommunityFeedbackHarvesterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraCommunityFeedbackHarvester extends BaseManager {}

export const __infraCommunityFeedbackHarvesterInternals = toolkit.internals;
