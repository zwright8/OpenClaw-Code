import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_evidence_provenance_tracker',
    collectionField: 'evidenceNodes',
    idField: 'evidenceId',
    defaultName: 'Oversight Evidence Node',
    readyPosture: 'oversight_provenance_tracked',
    defaultAgentId: 'agent:oversight-provenance',
    recommendationTypes: {
        primary: 'track_oversight_evidence_provenance',
        guard: 'mitigate_oversight_untraceable_claim_risk',
        audit: 'audit_oversight_provenance_signals',
        publish: 'publish_oversight_provenance_status'
    },
    recommendationTargetMap: {
        track_oversight_evidence_provenance: 'agent:oversight',
        mitigate_oversight_untraceable_claim_risk: 'agent:compliance',
        audit_oversight_provenance_signals: 'agent:trust',
        publish_oversight_provenance_status: 'agent:ops'
    }
});

export function trackOversightEvidenceProvenance(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightEvidenceProvenanceTrackerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightEvidenceProvenanceTracker extends BaseManager {}

export const __oversightEvidenceProvenanceTrackerInternals = toolkit.internals;
