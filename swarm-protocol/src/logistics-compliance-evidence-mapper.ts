import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_compliance_evidence_mapper',
    collectionField: 'controls',
    idField: 'controlId',
    defaultName: 'Logistics Control',
    readyPosture: 'logistics_compliance_evidence_mapped',
    defaultAgentId: 'agent:logistics-compliance-evidence',
    recommendationTypes: {
        primary: 'map_logistics_compliance_control_evidence',
        guard: 'mitigate_logistics_evidence_coverage_gap',
        audit: 'audit_logistics_compliance_evidence_signals',
        publish: 'publish_logistics_compliance_evidence_status'
    },
    recommendationTargetMap: {
        map_logistics_compliance_control_evidence: 'agent:compliance',
        mitigate_logistics_evidence_coverage_gap: 'agent:logistics',
        audit_logistics_compliance_evidence_signals: 'agent:trust',
        publish_logistics_compliance_evidence_status: 'agent:ops'
    }
});

export function mapLogisticsComplianceEvidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsComplianceEvidenceMapperToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsComplianceEvidenceMapper extends BaseManager {}

export const __logisticsComplianceEvidenceMapperInternals = toolkit.internals;
