import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_compliance_evidence_mapper',
    collectionField: 'controls',
    idField: 'controlId',
    defaultName: 'Governance Control',
    readyPosture: 'governance_compliance_evidence_mapped',
    defaultAgentId: 'agent:governance-compliance-evidence',
    recommendationTypes: {
        primary: 'map_governance_compliance_control_evidence',
        guard: 'mitigate_governance_evidence_coverage_gap',
        audit: 'audit_governance_compliance_evidence_signals',
        publish: 'publish_governance_compliance_evidence_status'
    },
    recommendationTargetMap: {
        map_governance_compliance_control_evidence: 'agent:compliance',
        mitigate_governance_evidence_coverage_gap: 'agent:governance',
        audit_governance_compliance_evidence_signals: 'agent:trust',
        publish_governance_compliance_evidence_status: 'agent:ops'
    }
});

export function mapGovernanceComplianceEvidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceComplianceEvidenceMapperToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceComplianceEvidenceMapper extends BaseManager {}

export const __governanceComplianceEvidenceMapperInternals = toolkit.internals;
