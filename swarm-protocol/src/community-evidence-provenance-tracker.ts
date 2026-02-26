import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_evidence_provenance_tracker',
    collectionField: 'evidenceNodes',
    idField: 'evidenceId',
    defaultName: 'Community Evidence Node',
    readyPosture: 'community_provenance_tracked',
    defaultAgentId: 'agent:community-provenance',
    recommendationTypes: {
        primary: 'track_community_evidence_provenance',
        guard: 'mitigate_community_untraceable_claim_risk',
        audit: 'audit_community_provenance_signals',
        publish: 'publish_community_provenance_status'
    },
    recommendationTargetMap: {
        track_community_evidence_provenance: 'agent:community',
        mitigate_community_untraceable_claim_risk: 'agent:compliance',
        audit_community_provenance_signals: 'agent:trust',
        publish_community_provenance_status: 'agent:ops'
    }
});

export function trackCommunityEvidenceProvenance(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityEvidenceProvenanceTrackerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityEvidenceProvenanceTracker extends BaseManager {}

export const __communityEvidenceProvenanceTrackerInternals = toolkit.internals;
