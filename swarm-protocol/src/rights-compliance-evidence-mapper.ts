import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_compliance_evidence_mapper',
    collectionField: 'controls',
    idField: 'controlId',
    defaultName: 'Rights Control',
    readyPosture: 'rights_compliance_evidence_mapped',
    defaultAgentId: 'agent:rights-compliance-evidence',
    recommendationTypes: {
        primary: 'map_rights_compliance_evidence',
        guard: 'mitigate_rights_evidence_coverage_gaps',
        audit: 'audit_rights_compliance_evidence_signals',
        publish: 'publish_rights_compliance_evidence_status'
    },
    recommendationTargetMap: {
        map_rights_compliance_evidence: 'agent:rights',
        mitigate_rights_evidence_coverage_gaps: 'agent:compliance',
        audit_rights_compliance_evidence_signals: 'agent:trust',
        publish_rights_compliance_evidence_status: 'agent:ops'
    }
});

export function mapRightsComplianceEvidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsComplianceEvidenceMapperToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsComplianceEvidenceMapper extends BaseManager {}

export const __rightsComplianceEvidenceMapperInternals = toolkit.internals;
