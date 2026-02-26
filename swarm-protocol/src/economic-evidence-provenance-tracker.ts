import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_evidence_provenance_tracker',
    collectionField: 'evidenceNodes',
    idField: 'evidenceId',
    defaultName: 'Economic Evidence Node',
    readyPosture: 'economic_provenance_tracked',
    defaultAgentId: 'agent:economic-provenance',
    recommendationTypes: {
        primary: 'track_economic_evidence_provenance',
        guard: 'mitigate_untraceable_claim_risk',
        audit: 'audit_economic_provenance_signals',
        publish: 'publish_economic_provenance_status'
    },
    recommendationTargetMap: {
        track_economic_evidence_provenance: 'agent:economic',
        mitigate_untraceable_claim_risk: 'agent:compliance',
        audit_economic_provenance_signals: 'agent:trust',
        publish_economic_provenance_status: 'agent:ops'
    }
});

export function trackEconomicEvidenceProvenance(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicEvidenceProvenanceTrackerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicEvidenceProvenanceTracker extends BaseManager {}

export const __economicEvidenceProvenanceTrackerInternals = toolkit.internals;
