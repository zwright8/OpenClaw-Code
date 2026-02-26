import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_compliance_evidence_mapper',
    collectionField: 'controls',
    idField: 'controlId',
    defaultName: 'Engineering Control',
    readyPosture: 'engineering_compliance_evidence_mapped',
    defaultAgentId: 'agent:engineering-compliance-evidence',
    recommendationTypes: {
        primary: 'map_engineering_compliance_control_evidence',
        guard: 'mitigate_engineering_evidence_coverage_gap',
        audit: 'audit_engineering_compliance_evidence_signals',
        publish: 'publish_engineering_compliance_evidence_status'
    },
    recommendationTargetMap: {
        map_engineering_compliance_control_evidence: 'agent:compliance',
        mitigate_engineering_evidence_coverage_gap: 'agent:engineering',
        audit_engineering_compliance_evidence_signals: 'agent:trust',
        publish_engineering_compliance_evidence_status: 'agent:ops'
    }
});

export function mapEngineeringComplianceEvidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringComplianceEvidenceMapperToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringComplianceEvidenceMapper extends BaseManager {}

export const __engineeringComplianceEvidenceMapperInternals = toolkit.internals;
