import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_compliance_evidence_mapper',
    collectionField: 'controls',
    idField: 'controlId',
    defaultName: 'Observability Control',
    readyPosture: 'observability_compliance_evidence_mapped',
    defaultAgentId: 'agent:observability-compliance-evidence',
    recommendationTypes: {
        primary: 'map_observability_compliance_control_evidence',
        guard: 'mitigate_observability_evidence_coverage_gap',
        audit: 'audit_observability_compliance_evidence_signals',
        publish: 'publish_observability_compliance_evidence_status'
    },
    recommendationTargetMap: {
        map_observability_compliance_control_evidence: 'agent:compliance',
        mitigate_observability_evidence_coverage_gap: 'agent:observability',
        audit_observability_compliance_evidence_signals: 'agent:trust',
        publish_observability_compliance_evidence_status: 'agent:ops'
    }
});

export function mapObservabilityComplianceEvidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityComplianceEvidenceMapperToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityComplianceEvidenceMapper extends BaseManager {}

export const __observabilityComplianceEvidenceMapperInternals = toolkit.internals;
