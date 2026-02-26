import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_evidence_provenance_tracker',
    collectionField: 'evidenceNodes',
    idField: 'evidenceId',
    defaultName: 'Evidence Node',
    readyPosture: 'research_provenance_tracked',
    defaultAgentId: 'agent:research-provenance',
    recommendationTypes: {
        primary: 'track_research_evidence_provenance',
        guard: 'mitigate_untraceable_claim_risk',
        audit: 'audit_research_provenance_signals',
        publish: 'publish_research_provenance_status'
    },
    recommendationTargetMap: {
        track_research_evidence_provenance: 'agent:research',
        mitigate_untraceable_claim_risk: 'agent:compliance',
        audit_research_provenance_signals: 'agent:trust',
        publish_research_provenance_status: 'agent:ops'
    }
});

export function trackResearchEvidenceProvenance(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchEvidenceProvenanceTrackerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchEvidenceProvenanceTracker extends BaseManager {}

export const __researchEvidenceProvenanceTrackerInternals = toolkit.internals;
