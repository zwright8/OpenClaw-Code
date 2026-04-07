import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_evidence_provenance_tracker',
    collectionField: 'evidenceNodes',
    idField: 'evidenceId',
    defaultName: 'Rights Evidence Node',
    readyPosture: 'rights_provenance_tracked',
    defaultAgentId: 'agent:rights-provenance',
    recommendationTypes: {
        primary: 'track_rights_evidence_provenance',
        guard: 'mitigate_rights_untraceable_claim_risk',
        audit: 'audit_rights_provenance_signals',
        publish: 'publish_rights_provenance_status'
    },
    recommendationTargetMap: {
        track_rights_evidence_provenance: 'agent:rights',
        mitigate_rights_untraceable_claim_risk: 'agent:compliance',
        audit_rights_provenance_signals: 'agent:trust',
        publish_rights_provenance_status: 'agent:ops'
    }
});

export function trackRightsEvidenceProvenance(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsEvidenceProvenanceTrackerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsEvidenceProvenanceTracker extends BaseManager {}

export const __rightsEvidenceProvenanceTrackerInternals = toolkit.internals;
