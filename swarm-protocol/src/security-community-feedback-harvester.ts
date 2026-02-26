import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_community_feedback_harvester',
    collectionField: 'feedbackEntries',
    idField: 'entryId',
    defaultName: 'Security Feedback Entry',
    readyPosture: 'security_community_feedback_harvest_ready',
    defaultAgentId: 'agent:security-feedback-harvester',
    recommendationTypes: {
        primary: 'harvest_security_community_feedback',
        guard: 'mitigate_security_unaddressed_feedback_risk',
        audit: 'audit_security_feedback_harvest_signals',
        publish: 'publish_security_feedback_harvest_status'
    },
    recommendationTargetMap: {
        harvest_security_community_feedback: 'agent:community',
        mitigate_security_unaddressed_feedback_risk: 'agent:product',
        audit_security_feedback_harvest_signals: 'agent:trust',
        publish_security_feedback_harvest_status: 'agent:ops'
    }
});

export function harvestSecurityCommunityFeedback(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityCommunityFeedbackHarvesterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityCommunityFeedbackHarvester extends BaseManager {}

export const __securityCommunityFeedbackHarvesterInternals = toolkit.internals;
