import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_evidence_provenance_tracker',
    collectionField: 'evidenceNodes',
    idField: 'evidenceId',
    defaultName: 'Evidence Node',
    readyPosture: 'crisis_provenance_tracked',
    defaultAgentId: 'agent:crisis-provenance',
    recommendationTypes: {
        primary: 'track_crisis_evidence_provenance',
        guard: 'mitigate_untraceable_claim_risk',
        audit: 'audit_crisis_provenance_signals',
        publish: 'publish_crisis_provenance_status'
    },
    recommendationTargetMap: {
        track_crisis_evidence_provenance: 'agent:crisis',
        mitigate_untraceable_claim_risk: 'agent:compliance',
        audit_crisis_provenance_signals: 'agent:trust',
        publish_crisis_provenance_status: 'agent:ops'
    }
});

export function trackCrisisEvidenceProvenance(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisEvidenceProvenanceTrackerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisEvidenceProvenanceTracker extends BaseManager {}

export const __crisisEvidenceProvenanceTrackerInternals = toolkit.internals;
