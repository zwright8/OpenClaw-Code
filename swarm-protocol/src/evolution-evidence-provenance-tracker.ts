import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_evidence_provenance_tracker',
    collectionField: 'evidenceNodes',
    idField: 'evidenceId',
    defaultName: 'Evolution Evidence Node',
    readyPosture: 'evolution_provenance_tracked',
    defaultAgentId: 'agent:evolution-provenance',
    recommendationTypes: {
        primary: 'track_evolution_evidence_provenance',
        guard: 'mitigate_evolution_untraceable_claim_risk',
        audit: 'audit_evolution_provenance_signals',
        publish: 'publish_evolution_provenance_status'
    },
    recommendationTargetMap: {
        track_evolution_evidence_provenance: 'agent:evolution',
        mitigate_evolution_untraceable_claim_risk: 'agent:learning',
        audit_evolution_provenance_signals: 'agent:trust',
        publish_evolution_provenance_status: 'agent:ops'
    }
});

export function trackEvolutionEvidenceProvenance(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionEvidenceProvenanceTrackerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionEvidenceProvenanceTracker extends BaseManager {}

export const __evolutionEvidenceProvenanceTrackerInternals = toolkit.internals;
