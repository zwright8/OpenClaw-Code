import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_evidence_provenance_tracker',
    collectionField: 'evidenceNodes',
    idField: 'evidenceId',
    defaultName: 'Education Evidence Node',
    readyPosture: 'education_provenance_tracked',
    defaultAgentId: 'agent:education-provenance',
    recommendationTypes: {
        primary: 'track_education_evidence_provenance',
        guard: 'mitigate_untraceable_claim_risk',
        audit: 'audit_education_provenance_signals',
        publish: 'publish_education_provenance_status'
    },
    recommendationTargetMap: {
        track_education_evidence_provenance: 'agent:education',
        mitigate_untraceable_claim_risk: 'agent:compliance',
        audit_education_provenance_signals: 'agent:trust',
        publish_education_provenance_status: 'agent:ops'
    }
});

export function trackEducationEvidenceProvenance(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationEvidenceProvenanceTrackerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationEvidenceProvenanceTracker extends BaseManager {}

export const __educationEvidenceProvenanceTrackerInternals = toolkit.internals;
