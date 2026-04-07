import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_evidence_provenance_tracker',
    collectionField: 'evidenceNodes',
    idField: 'evidenceId',
    defaultName: 'Evidence Node',
    readyPosture: 'impact_provenance_tracked',
    defaultAgentId: 'agent:impact-provenance',
    recommendationTypes: {
        primary: 'track_impact_evidence_provenance',
        guard: 'mitigate_untraceable_claim_risk',
        audit: 'audit_impact_provenance_signals',
        publish: 'publish_impact_provenance_status'
    },
    recommendationTargetMap: {
        track_impact_evidence_provenance: 'agent:impact',
        mitigate_untraceable_claim_risk: 'agent:compliance',
        audit_impact_provenance_signals: 'agent:trust',
        publish_impact_provenance_status: 'agent:ops'
    }
});

export function trackImpactEvidenceProvenance(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactEvidenceProvenanceTrackerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactEvidenceProvenanceTracker extends BaseManager {}

export const __impactEvidenceProvenanceTrackerInternals = toolkit.internals;
