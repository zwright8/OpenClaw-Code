import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_compliance_evidence_mapper',
    collectionField: 'controls',
    idField: 'controlId',
    defaultName: 'Economic Control',
    readyPosture: 'economic_compliance_evidence_mapped',
    defaultAgentId: 'agent:economic-compliance-evidence',
    recommendationTypes: {
        primary: 'map_economic_compliance_control_evidence',
        guard: 'mitigate_economic_evidence_coverage_gap',
        audit: 'audit_economic_compliance_evidence_signals',
        publish: 'publish_economic_compliance_evidence_status'
    },
    recommendationTargetMap: {
        map_economic_compliance_control_evidence: 'agent:compliance',
        mitigate_economic_evidence_coverage_gap: 'agent:economic',
        audit_economic_compliance_evidence_signals: 'agent:trust',
        publish_economic_compliance_evidence_status: 'agent:ops'
    }
});

export function mapEconomicComplianceEvidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicComplianceEvidenceMapperToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicComplianceEvidenceMapper extends BaseManager {}

export const __economicComplianceEvidenceMapperInternals = toolkit.internals;
