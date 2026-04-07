import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_compliance_evidence_mapper',
    collectionField: 'controls',
    idField: 'controlId',
    defaultName: 'Comms Control',
    readyPosture: 'comms_compliance_evidence_mapped',
    defaultAgentId: 'agent:comms-compliance-evidence',
    recommendationTypes: {
        primary: 'map_comms_compliance_control_evidence',
        guard: 'mitigate_comms_evidence_coverage_gap',
        audit: 'audit_comms_compliance_evidence_signals',
        publish: 'publish_comms_compliance_evidence_status'
    },
    recommendationTargetMap: {
        map_comms_compliance_control_evidence: 'agent:compliance',
        mitigate_comms_evidence_coverage_gap: 'agent:comms',
        audit_comms_compliance_evidence_signals: 'agent:trust',
        publish_comms_compliance_evidence_status: 'agent:ops'
    }
});

export function mapCommsComplianceEvidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsComplianceEvidenceMapperToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsComplianceEvidenceMapper extends BaseManager {}

export const __commsComplianceEvidenceMapperInternals = toolkit.internals;
