import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_compliance_evidence_mapper',
    collectionField: 'controls',
    idField: 'controlId',
    defaultName: 'Cultural Control',
    readyPosture: 'cultural_compliance_evidence_mapped',
    defaultAgentId: 'agent:cultural-compliance-evidence',
    recommendationTypes: {
        primary: 'map_cultural_compliance_control_evidence',
        guard: 'mitigate_cultural_evidence_coverage_gap',
        audit: 'audit_cultural_compliance_evidence_signals',
        publish: 'publish_cultural_compliance_evidence_status'
    },
    recommendationTargetMap: {
        map_cultural_compliance_control_evidence: 'agent:compliance',
        mitigate_cultural_evidence_coverage_gap: 'agent:cultural',
        audit_cultural_compliance_evidence_signals: 'agent:trust',
        publish_cultural_compliance_evidence_status: 'agent:ops'
    }
});

export function mapCulturalComplianceEvidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalComplianceEvidenceMapperToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalComplianceEvidenceMapper extends BaseManager {}

export const __culturalComplianceEvidenceMapperInternals = toolkit.internals;
