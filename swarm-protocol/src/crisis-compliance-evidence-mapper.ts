import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_compliance_evidence_mapper',
    collectionField: 'controls',
    idField: 'controlId',
    defaultName: 'Crisis Control',
    readyPosture: 'crisis_compliance_evidence_mapped',
    defaultAgentId: 'agent:crisis-compliance-evidence',
    recommendationTypes: {
        primary: 'map_crisis_compliance_control_evidence',
        guard: 'mitigate_crisis_evidence_coverage_gap',
        audit: 'audit_crisis_compliance_evidence_signals',
        publish: 'publish_crisis_compliance_evidence_status'
    },
    recommendationTargetMap: {
        map_crisis_compliance_control_evidence: 'agent:compliance',
        mitigate_crisis_evidence_coverage_gap: 'agent:crisis',
        audit_crisis_compliance_evidence_signals: 'agent:trust',
        publish_crisis_compliance_evidence_status: 'agent:ops'
    }
});

export function mapCrisisComplianceEvidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisComplianceEvidenceMapperToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisComplianceEvidenceMapper extends BaseManager {}

export const __crisisComplianceEvidenceMapperInternals = toolkit.internals;
