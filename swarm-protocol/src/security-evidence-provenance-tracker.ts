import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_evidence_provenance_tracker',
    collectionField: 'evidenceNodes',
    idField: 'evidenceId',
    defaultName: 'Evidence Node',
    readyPosture: 'security_provenance_tracked',
    defaultAgentId: 'agent:security-provenance',
    recommendationTypes: {
        primary: 'track_security_evidence_provenance',
        guard: 'mitigate_untraceable_claim_risk',
        audit: 'audit_security_provenance_signals',
        publish: 'publish_security_provenance_status'
    },
    recommendationTargetMap: {
        track_security_evidence_provenance: 'agent:security',
        mitigate_untraceable_claim_risk: 'agent:compliance',
        audit_security_provenance_signals: 'agent:trust',
        publish_security_provenance_status: 'agent:ops'
    }
});

export function trackSecurityEvidenceProvenance(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityEvidenceProvenanceTrackerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityEvidenceProvenanceTracker extends BaseManager {}

export const __securityEvidenceProvenanceTrackerInternals = toolkit.internals;
