import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_evidence_provenance_tracker',
    collectionField: 'evidenceNodes',
    idField: 'evidenceId',
    defaultName: 'PublicService Evidence Node',
    readyPosture: 'publicservice_provenance_tracked',
    defaultAgentId: 'agent:publicservice-provenance',
    recommendationTypes: {
        primary: 'track_publicservice_evidence_provenance',
        guard: 'mitigate_publicservice_untraceable_claim_risk',
        audit: 'audit_publicservice_provenance_signals',
        publish: 'publish_publicservice_provenance_status'
    },
    recommendationTargetMap: {
        track_publicservice_evidence_provenance: 'agent:publicservice',
        mitigate_publicservice_untraceable_claim_risk: 'agent:compliance',
        audit_publicservice_provenance_signals: 'agent:trust',
        publish_publicservice_provenance_status: 'agent:ops'
    }
});

export function trackPublicServiceEvidenceProvenance(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceEvidenceProvenanceTrackerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceEvidenceProvenanceTracker extends BaseManager {}

export const __publicServiceEvidenceProvenanceTrackerInternals = toolkit.internals;
