import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_evidence_provenance_tracker',
    collectionField: 'evidenceNodes',
    idField: 'evidenceId',
    defaultName: 'Evidence Node',
    readyPosture: 'cultural_provenance_tracked',
    defaultAgentId: 'agent:cultural-provenance',
    recommendationTypes: {
        primary: 'track_cultural_evidence_provenance',
        guard: 'mitigate_untraceable_claim_risk',
        audit: 'audit_cultural_provenance_signals',
        publish: 'publish_cultural_provenance_status'
    },
    recommendationTargetMap: {
        track_cultural_evidence_provenance: 'agent:cultural',
        mitigate_untraceable_claim_risk: 'agent:compliance',
        audit_cultural_provenance_signals: 'agent:trust',
        publish_cultural_provenance_status: 'agent:ops'
    }
});

export function trackCulturalEvidenceProvenance(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalEvidenceProvenanceTrackerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalEvidenceProvenanceTracker extends BaseManager {}

export const __culturalEvidenceProvenanceTrackerInternals = toolkit.internals;
