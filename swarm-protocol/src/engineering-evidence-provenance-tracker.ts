import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_evidence_provenance_tracker',
    collectionField: 'evidenceNodes',
    idField: 'evidenceId',
    defaultName: 'Evidence Node',
    readyPosture: 'engineering_provenance_tracked',
    defaultAgentId: 'agent:engineering-provenance',
    recommendationTypes: {
        primary: 'track_engineering_evidence_provenance',
        guard: 'mitigate_untraceable_claim_risk',
        audit: 'audit_engineering_provenance_signals',
        publish: 'publish_engineering_provenance_status'
    },
    recommendationTargetMap: {
        track_engineering_evidence_provenance: 'agent:engineering',
        mitigate_untraceable_claim_risk: 'agent:compliance',
        audit_engineering_provenance_signals: 'agent:trust',
        publish_engineering_provenance_status: 'agent:ops'
    }
});

export function trackEngineeringEvidenceProvenance(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringEvidenceProvenanceTrackerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringEvidenceProvenanceTracker extends BaseManager {}

export const __engineeringEvidenceProvenanceTrackerInternals = toolkit.internals;
