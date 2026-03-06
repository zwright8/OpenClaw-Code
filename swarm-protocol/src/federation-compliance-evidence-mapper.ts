import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_compliance_evidence_mapper',
    collectionField: 'controls',
    idField: 'controlId',
    defaultName: 'Federation Control',
    readyPosture: 'federation_compliance_evidence_mapped',
    defaultAgentId: 'agent:federation-compliance-evidence',
    recommendationTypes: {
        primary: 'map_federation_compliance_control_evidence',
        guard: 'mitigate_federation_evidence_coverage_gap',
        audit: 'audit_federation_compliance_evidence_signals',
        publish: 'publish_federation_compliance_evidence_status'
    },
    recommendationTargetMap: {
        map_federation_compliance_control_evidence: 'agent:compliance',
        mitigate_federation_evidence_coverage_gap: 'agent:federation',
        audit_federation_compliance_evidence_signals: 'agent:trust',
        publish_federation_compliance_evidence_status: 'agent:ops'
    }
});

export function mapFederationComplianceEvidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationComplianceEvidenceMapperToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationComplianceEvidenceMapper extends BaseManager {}

export const __federationComplianceEvidenceMapperInternals = toolkit.internals;
