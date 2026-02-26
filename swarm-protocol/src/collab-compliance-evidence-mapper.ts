import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_compliance_evidence_mapper',
    collectionField: 'controls',
    idField: 'controlId',
    defaultName: 'Collab Control',
    readyPosture: 'collab_compliance_evidence_mapped',
    defaultAgentId: 'agent:collab-compliance-evidence',
    recommendationTypes: {
        primary: 'map_collab_compliance_control_evidence',
        guard: 'mitigate_collab_evidence_coverage_gap',
        audit: 'audit_collab_compliance_evidence_signals',
        publish: 'publish_collab_compliance_evidence_status'
    },
    recommendationTargetMap: {
        map_collab_compliance_control_evidence: 'agent:compliance',
        mitigate_collab_evidence_coverage_gap: 'agent:collab',
        audit_collab_compliance_evidence_signals: 'agent:trust',
        publish_collab_compliance_evidence_status: 'agent:ops'
    }
});

export function mapCollabComplianceEvidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabComplianceEvidenceMapperToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabComplianceEvidenceMapper extends BaseManager {}

export const __collabComplianceEvidenceMapperInternals = toolkit.internals;
