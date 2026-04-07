import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_community_feedback_harvester',
    collectionField: 'feedbackEntries',
    idField: 'entryId',
    defaultName: 'Rights Feedback Entry',
    readyPosture: 'rights_feedback_harvested',
    defaultAgentId: 'agent:rights-feedback',
    recommendationTypes: {
        primary: 'harvest_rights_community_feedback',
        guard: 'mitigate_rights_feedback_blindspots',
        audit: 'audit_rights_feedback_signals',
        publish: 'publish_rights_feedback_status'
    },
    recommendationTargetMap: {
        harvest_rights_community_feedback: 'agent:rights',
        mitigate_rights_feedback_blindspots: 'agent:community',
        audit_rights_feedback_signals: 'agent:trust',
        publish_rights_feedback_status: 'agent:ops'
    }
});

export function harvestRightsCommunityFeedback(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsCommunityFeedbackHarvesterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsCommunityFeedbackHarvester extends BaseManager {}

export const __rightsCommunityFeedbackHarvesterInternals = toolkit.internals;
