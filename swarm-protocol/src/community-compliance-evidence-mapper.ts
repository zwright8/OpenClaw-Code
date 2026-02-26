import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_compliance_evidence_mapper',
    collectionField: 'controls',
    idField: 'controlId',
    defaultName: 'Community Control',
    readyPosture: 'community_compliance_evidence_mapped',
    defaultAgentId: 'agent:community-compliance-evidence',
    recommendationTypes: {
        primary: 'map_community_compliance_control_evidence',
        guard: 'mitigate_community_evidence_coverage_gap',
        audit: 'audit_community_compliance_evidence_signals',
        publish: 'publish_community_compliance_evidence_status'
    },
    recommendationTargetMap: {
        map_community_compliance_control_evidence: 'agent:compliance',
        mitigate_community_evidence_coverage_gap: 'agent:community',
        audit_community_compliance_evidence_signals: 'agent:trust',
        publish_community_compliance_evidence_status: 'agent:ops'
    }
});

export function mapCommunityComplianceEvidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityComplianceEvidenceMapperToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityComplianceEvidenceMapper extends BaseManager {}

export const __communityComplianceEvidenceMapperInternals = toolkit.internals;
