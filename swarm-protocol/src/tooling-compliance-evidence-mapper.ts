import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'tooling_compliance_evidence_mapper',
    collectionField: 'controls',
    idField: 'controlId',
    defaultName: 'Control',
    readyPosture: 'compliance_evidence_mapped',
    defaultAgentId: 'agent:tooling-compliance-evidence',
    recommendationTypes: {
        primary: 'map_compliance_control_evidence',
        guard: 'mitigate_evidence_coverage_gap',
        audit: 'audit_compliance_evidence_signals',
        publish: 'publish_compliance_evidence_status'
    },
    recommendationTargetMap: {
        map_compliance_control_evidence: 'agent:compliance',
        mitigate_evidence_coverage_gap: 'agent:governance',
        audit_compliance_evidence_signals: 'agent:trust',
        publish_compliance_evidence_status: 'agent:ops'
    }
});

export function mapToolingComplianceEvidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function toolingComplianceEvidenceMapperToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ToolingComplianceEvidenceMapper extends BaseManager {}

export const __toolingComplianceEvidenceMapperInternals = toolkit.internals;
