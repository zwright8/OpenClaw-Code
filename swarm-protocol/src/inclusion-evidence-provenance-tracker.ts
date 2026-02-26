import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_evidence_provenance_tracker',
    collectionField: 'evidenceNodes',
    idField: 'evidenceId',
    defaultName: 'Inclusion Evidence Node',
    readyPosture: 'inclusion_provenance_tracked',
    defaultAgentId: 'agent:inclusion-provenance',
    recommendationTypes: {
        primary: 'track_inclusion_evidence_provenance',
        guard: 'mitigate_inclusion_untraceable_claim_risk',
        audit: 'audit_inclusion_provenance_signals',
        publish: 'publish_inclusion_provenance_status'
    },
    recommendationTargetMap: {
        track_inclusion_evidence_provenance: 'agent:inclusion',
        mitigate_inclusion_untraceable_claim_risk: 'agent:compliance',
        audit_inclusion_provenance_signals: 'agent:trust',
        publish_inclusion_provenance_status: 'agent:ops'
    }
});

export function trackInclusionEvidenceProvenance(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionEvidenceProvenanceTrackerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionEvidenceProvenanceTracker extends BaseManager {}

export const __inclusionEvidenceProvenanceTrackerInternals = toolkit.internals;
