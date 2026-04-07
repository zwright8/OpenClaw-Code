import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_compliance_evidence_mapper',
    collectionField: 'controls',
    idField: 'controlId',
    defaultName: 'Education Control',
    readyPosture: 'education_compliance_evidence_mapped',
    defaultAgentId: 'agent:education-compliance-evidence',
    recommendationTypes: {
        primary: 'map_education_compliance_control_evidence',
        guard: 'mitigate_education_evidence_coverage_gap',
        audit: 'audit_education_compliance_evidence_signals',
        publish: 'publish_education_compliance_evidence_status'
    },
    recommendationTargetMap: {
        map_education_compliance_control_evidence: 'agent:compliance',
        mitigate_education_evidence_coverage_gap: 'agent:education',
        audit_education_compliance_evidence_signals: 'agent:trust',
        publish_education_compliance_evidence_status: 'agent:ops'
    }
});

export function mapEducationComplianceEvidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationComplianceEvidenceMapperToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationComplianceEvidenceMapper extends BaseManager {}

export const __educationComplianceEvidenceMapperInternals = toolkit.internals;
