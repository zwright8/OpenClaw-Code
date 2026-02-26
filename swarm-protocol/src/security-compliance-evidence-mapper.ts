import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_compliance_evidence_mapper',
    collectionField: 'controls',
    idField: 'controlId',
    defaultName: 'Security Control',
    readyPosture: 'security_compliance_evidence_mapped',
    defaultAgentId: 'agent:security-compliance-evidence',
    recommendationTypes: {
        primary: 'map_security_compliance_control_evidence',
        guard: 'mitigate_security_evidence_coverage_gap',
        audit: 'audit_security_compliance_evidence_signals',
        publish: 'publish_security_compliance_evidence_status'
    },
    recommendationTargetMap: {
        map_security_compliance_control_evidence: 'agent:compliance',
        mitigate_security_evidence_coverage_gap: 'agent:security',
        audit_security_compliance_evidence_signals: 'agent:trust',
        publish_security_compliance_evidence_status: 'agent:ops'
    }
});

export function mapSecurityComplianceEvidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityComplianceEvidenceMapperToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityComplianceEvidenceMapper extends BaseManager {}

export const __securityComplianceEvidenceMapperInternals = toolkit.internals;
