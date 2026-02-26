import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_evidence_provenance_tracker',
    collectionField: 'evidenceNodes',
    idField: 'evidenceId',
    defaultName: 'Evidence Node',
    readyPosture: 'comms_provenance_tracked',
    defaultAgentId: 'agent:comms-provenance',
    recommendationTypes: {
        primary: 'track_comms_evidence_provenance',
        guard: 'mitigate_untraceable_claim_risk',
        audit: 'audit_comms_provenance_signals',
        publish: 'publish_comms_provenance_status'
    },
    recommendationTargetMap: {
        track_comms_evidence_provenance: 'agent:comms',
        mitigate_untraceable_claim_risk: 'agent:compliance',
        audit_comms_provenance_signals: 'agent:trust',
        publish_comms_provenance_status: 'agent:ops'
    }
});

export function trackCommsEvidenceProvenance(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsEvidenceProvenanceTrackerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsEvidenceProvenanceTracker extends BaseManager {}

export const __commsEvidenceProvenanceTrackerInternals = toolkit.internals;
