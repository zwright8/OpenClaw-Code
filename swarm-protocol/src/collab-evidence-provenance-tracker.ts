import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_evidence_provenance_tracker',
    collectionField: 'evidenceNodes',
    idField: 'evidenceId',
    defaultName: 'Collab Evidence Node',
    readyPosture: 'collab_provenance_tracked',
    defaultAgentId: 'agent:collab-provenance',
    recommendationTypes: {
        primary: 'track_collab_evidence_provenance',
        guard: 'mitigate_collab_untraceable_claim_risk',
        audit: 'audit_collab_provenance_signals',
        publish: 'publish_collab_provenance_status'
    },
    recommendationTargetMap: {
        track_collab_evidence_provenance: 'agent:collab',
        mitigate_collab_untraceable_claim_risk: 'agent:compliance',
        audit_collab_provenance_signals: 'agent:trust',
        publish_collab_provenance_status: 'agent:ops'
    }
});

export function trackCollabEvidenceProvenance(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabEvidenceProvenanceTrackerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabEvidenceProvenanceTracker extends BaseManager {}

export const __collabEvidenceProvenanceTrackerInternals = toolkit.internals;
