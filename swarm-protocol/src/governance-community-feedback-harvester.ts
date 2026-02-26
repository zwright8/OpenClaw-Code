import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_community_feedback_harvester',
    collectionField: 'feedbackEntries',
    idField: 'entryId',
    defaultName: 'Governance Feedback Entry',
    readyPosture: 'governance_community_feedback_harvest_ready',
    defaultAgentId: 'agent:governance-feedback-harvester',
    recommendationTypes: {
        primary: 'harvest_governance_community_feedback',
        guard: 'mitigate_governance_unaddressed_feedback_risk',
        audit: 'audit_governance_feedback_harvest_signals',
        publish: 'publish_governance_feedback_harvest_status'
    },
    recommendationTargetMap: {
        harvest_governance_community_feedback: 'agent:community',
        mitigate_governance_unaddressed_feedback_risk: 'agent:product',
        audit_governance_feedback_harvest_signals: 'agent:trust',
        publish_governance_feedback_harvest_status: 'agent:ops'
    }
});

export function harvestGovernanceCommunityFeedback(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceCommunityFeedbackHarvesterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceCommunityFeedbackHarvester extends BaseManager {}

export const __governanceCommunityFeedbackHarvesterInternals = toolkit.internals;
