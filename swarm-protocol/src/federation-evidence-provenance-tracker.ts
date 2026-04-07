import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_evidence_provenance_tracker',
    collectionField: 'evidenceNodes',
    idField: 'evidenceId',
    defaultName: 'Federation Evidence Node',
    readyPosture: 'federation_provenance_tracked',
    defaultAgentId: 'agent:federation-provenance',
    recommendationTypes: {
        primary: 'track_federation_evidence_provenance',
        guard: 'mitigate_untraceable_claim_risk',
        audit: 'audit_federation_provenance_signals',
        publish: 'publish_federation_provenance_status'
    },
    recommendationTargetMap: {
        track_federation_evidence_provenance: 'agent:federation',
        mitigate_untraceable_claim_risk: 'agent:compliance',
        audit_federation_provenance_signals: 'agent:trust',
        publish_federation_provenance_status: 'agent:ops'
    }
});

export function trackFederationEvidenceProvenance(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationEvidenceProvenanceTrackerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationEvidenceProvenanceTracker extends BaseManager {}

export const __federationEvidenceProvenanceTrackerInternals = toolkit.internals;
