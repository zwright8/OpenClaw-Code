import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_evidence_provenance_tracker',
    collectionField: 'evidenceNodes',
    idField: 'evidenceId',
    defaultName: 'Evidence Node',
    readyPosture: 'governance_provenance_tracked',
    defaultAgentId: 'agent:governance-provenance',
    recommendationTypes: {
        primary: 'track_governance_evidence_provenance',
        guard: 'mitigate_untraceable_claim_risk',
        audit: 'audit_governance_provenance_signals',
        publish: 'publish_governance_provenance_status'
    },
    recommendationTargetMap: {
        track_governance_evidence_provenance: 'agent:governance',
        mitigate_untraceable_claim_risk: 'agent:compliance',
        audit_governance_provenance_signals: 'agent:trust',
        publish_governance_provenance_status: 'agent:ops'
    }
});

export function trackGovernanceEvidenceProvenance(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceEvidenceProvenanceTrackerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceEvidenceProvenanceTracker extends BaseManager {}

export const __governanceEvidenceProvenanceTrackerInternals = toolkit.internals;
