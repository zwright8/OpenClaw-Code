import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_compliance_evidence_mapper',
    collectionField: 'controls',
    idField: 'controlId',
    defaultName: 'Infra Control',
    readyPosture: 'infra_compliance_evidence_mapped',
    defaultAgentId: 'agent:infra-compliance-evidence',
    recommendationTypes: {
        primary: 'map_infra_compliance_evidence',
        guard: 'mitigate_infra_evidence_coverage_gaps',
        audit: 'audit_infra_compliance_evidence_signals',
        publish: 'publish_infra_compliance_evidence_status'
    },
    recommendationTargetMap: {
        map_infra_compliance_evidence: 'agent:infra',
        mitigate_infra_evidence_coverage_gaps: 'agent:compliance',
        audit_infra_compliance_evidence_signals: 'agent:trust',
        publish_infra_compliance_evidence_status: 'agent:ops'
    }
});

export function mapInfraComplianceEvidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraComplianceEvidenceMapperToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraComplianceEvidenceMapper extends BaseManager {}

export const __infraComplianceEvidenceMapperInternals = toolkit.internals;
