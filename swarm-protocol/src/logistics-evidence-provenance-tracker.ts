import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_evidence_provenance_tracker',
    collectionField: 'evidenceNodes',
    idField: 'evidenceId',
    defaultName: 'Evidence Node',
    readyPosture: 'logistics_provenance_tracked',
    defaultAgentId: 'agent:logistics-provenance',
    recommendationTypes: {
        primary: 'track_logistics_evidence_provenance',
        guard: 'mitigate_untraceable_claim_risk',
        audit: 'audit_logistics_provenance_signals',
        publish: 'publish_logistics_provenance_status'
    },
    recommendationTargetMap: {
        track_logistics_evidence_provenance: 'agent:logistics',
        mitigate_untraceable_claim_risk: 'agent:compliance',
        audit_logistics_provenance_signals: 'agent:trust',
        publish_logistics_provenance_status: 'agent:ops'
    }
});

export function trackLogisticsEvidenceProvenance(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsEvidenceProvenanceTrackerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsEvidenceProvenanceTracker extends BaseManager {}

export const __logisticsEvidenceProvenanceTrackerInternals = toolkit.internals;
