import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_compliance_evidence_mapper',
    collectionField: 'controls',
    idField: 'controlId',
    defaultName: 'Research Control',
    readyPosture: 'research_compliance_evidence_mapped',
    defaultAgentId: 'agent:research-compliance-evidence',
    recommendationTypes: {
        primary: 'map_research_compliance_control_evidence',
        guard: 'mitigate_research_evidence_coverage_gap',
        audit: 'audit_research_compliance_evidence_signals',
        publish: 'publish_research_compliance_evidence_status'
    },
    recommendationTargetMap: {
        map_research_compliance_control_evidence: 'agent:compliance',
        mitigate_research_evidence_coverage_gap: 'agent:research',
        audit_research_compliance_evidence_signals: 'agent:trust',
        publish_research_compliance_evidence_status: 'agent:ops'
    }
});

export function mapResearchComplianceEvidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchComplianceEvidenceMapperToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchComplianceEvidenceMapper extends BaseManager {}

export const __researchComplianceEvidenceMapperInternals = toolkit.internals;
