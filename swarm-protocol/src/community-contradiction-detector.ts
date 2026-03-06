import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_contradiction_detector',
    collectionField: 'claims',
    idField: 'claimId',
    defaultName: 'Community Claim',
    readyPosture: 'community_contradictions_managed',
    defaultAgentId: 'agent:community-contradictions',
    recommendationTypes: {
        primary: 'detect_community_contradictions',
        guard: 'mitigate_conflicting_community_claims',
        audit: 'audit_community_contradiction_signals',
        publish: 'publish_community_contradiction_status'
    },
    recommendationTargetMap: {
        detect_community_contradictions: 'agent:community',
        mitigate_conflicting_community_claims: 'agent:policy',
        audit_community_contradiction_signals: 'agent:trust',
        publish_community_contradiction_status: 'agent:ops'
    }
});

export function detectCommunityContradictions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityContradictionDetectorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityContradictionDetector extends BaseManager {}

export const __communityContradictionDetectorInternals = toolkit.internals;
