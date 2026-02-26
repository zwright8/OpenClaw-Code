import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_compliance_evidence_mapper',
    collectionField: 'controls',
    idField: 'controlId',
    defaultName: 'PublicService Control',
    readyPosture: 'publicservice_compliance_evidence_mapped',
    defaultAgentId: 'agent:publicservice-compliance-evidence',
    recommendationTypes: {
        primary: 'map_publicservice_compliance_control_evidence',
        guard: 'mitigate_publicservice_evidence_coverage_gap',
        audit: 'audit_publicservice_compliance_evidence_signals',
        publish: 'publish_publicservice_compliance_evidence_status'
    },
    recommendationTargetMap: {
        map_publicservice_compliance_control_evidence: 'agent:compliance',
        mitigate_publicservice_evidence_coverage_gap: 'agent:publicservice',
        audit_publicservice_compliance_evidence_signals: 'agent:trust',
        publish_publicservice_compliance_evidence_status: 'agent:ops'
    }
});

export function mapPublicServiceComplianceEvidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceComplianceEvidenceMapperToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceComplianceEvidenceMapper extends BaseManager {}

export const __publicServiceComplianceEvidenceMapperInternals = toolkit.internals;
