import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_compliance_evidence_mapper',
    collectionField: 'controls',
    idField: 'controlId',
    defaultName: 'Oversight Control',
    readyPosture: 'oversight_compliance_evidence_mapped',
    defaultAgentId: 'agent:oversight-compliance-evidence',
    recommendationTypes: {
        primary: 'map_oversight_compliance_control_evidence',
        guard: 'mitigate_oversight_evidence_coverage_gap',
        audit: 'audit_oversight_compliance_evidence_signals',
        publish: 'publish_oversight_compliance_evidence_status'
    },
    recommendationTargetMap: {
        map_oversight_compliance_control_evidence: 'agent:compliance',
        mitigate_oversight_evidence_coverage_gap: 'agent:oversight',
        audit_oversight_compliance_evidence_signals: 'agent:trust',
        publish_oversight_compliance_evidence_status: 'agent:ops'
    }
});

export function mapOversightComplianceEvidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightComplianceEvidenceMapperToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightComplianceEvidenceMapper extends BaseManager {}

export const __oversightComplianceEvidenceMapperInternals = toolkit.internals;
