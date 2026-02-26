import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_evidence_provenance_tracker',
    collectionField: 'evidenceNodes',
    idField: 'evidenceId',
    defaultName: 'Infra Evidence Node',
    readyPosture: 'infra_provenance_tracked',
    defaultAgentId: 'agent:infra-provenance',
    recommendationTypes: {
        primary: 'track_infra_evidence_provenance',
        guard: 'mitigate_infra_untraceable_claim_risk',
        audit: 'audit_infra_provenance_signals',
        publish: 'publish_infra_provenance_status'
    },
    recommendationTargetMap: {
        track_infra_evidence_provenance: 'agent:infra',
        mitigate_infra_untraceable_claim_risk: 'agent:sustainability',
        audit_infra_provenance_signals: 'agent:trust',
        publish_infra_provenance_status: 'agent:ops'
    }
});

export function trackInfraEvidenceProvenance(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraEvidenceProvenanceTrackerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraEvidenceProvenanceTracker extends BaseManager {}

export const __infraEvidenceProvenanceTrackerInternals = toolkit.internals;
