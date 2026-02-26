import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_compliance_evidence_mapper',
    collectionField: 'controls',
    idField: 'controlId',
    defaultName: 'Inclusion Control',
    readyPosture: 'inclusion_compliance_evidence_mapped',
    defaultAgentId: 'agent:inclusion-compliance-evidence',
    recommendationTypes: {
        primary: 'map_inclusion_compliance_control_evidence',
        guard: 'mitigate_inclusion_evidence_coverage_gap',
        audit: 'audit_inclusion_compliance_evidence_signals',
        publish: 'publish_inclusion_compliance_evidence_status'
    },
    recommendationTargetMap: {
        map_inclusion_compliance_control_evidence: 'agent:compliance',
        mitigate_inclusion_evidence_coverage_gap: 'agent:inclusion',
        audit_inclusion_compliance_evidence_signals: 'agent:trust',
        publish_inclusion_compliance_evidence_status: 'agent:ops'
    }
});

export function mapInclusionComplianceEvidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionComplianceEvidenceMapperToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionComplianceEvidenceMapper extends BaseManager {}

export const __inclusionComplianceEvidenceMapperInternals = toolkit.internals;
