import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_compliance_evidence_mapper',
    collectionField: 'controls',
    idField: 'controlId',
    defaultName: 'Impact Control',
    readyPosture: 'impact_compliance_evidence_mapped',
    defaultAgentId: 'agent:impact-compliance-evidence',
    recommendationTypes: {
        primary: 'map_impact_compliance_control_evidence',
        guard: 'mitigate_impact_evidence_coverage_gap',
        audit: 'audit_impact_compliance_evidence_signals',
        publish: 'publish_impact_compliance_evidence_status'
    },
    recommendationTargetMap: {
        map_impact_compliance_control_evidence: 'agent:compliance',
        mitigate_impact_evidence_coverage_gap: 'agent:impact',
        audit_impact_compliance_evidence_signals: 'agent:trust',
        publish_impact_compliance_evidence_status: 'agent:ops'
    }
});

export function mapImpactComplianceEvidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactComplianceEvidenceMapperToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactComplianceEvidenceMapper extends BaseManager {}

export const __impactComplianceEvidenceMapperInternals = toolkit.internals;
