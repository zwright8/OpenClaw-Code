import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_compliance_evidence_mapper',
    collectionField: 'controls',
    idField: 'controlId',
    defaultName: 'Evolution Control',
    readyPosture: 'evolution_compliance_evidence_mapped',
    defaultAgentId: 'agent:evolution-compliance-evidence',
    recommendationTypes: {
        primary: 'map_evolution_compliance_evidence',
        guard: 'mitigate_evolution_evidence_coverage_gaps',
        audit: 'audit_evolution_compliance_evidence_signals',
        publish: 'publish_evolution_compliance_evidence_status'
    },
    recommendationTargetMap: {
        map_evolution_compliance_evidence: 'agent:evolution',
        mitigate_evolution_evidence_coverage_gaps: 'agent:compliance',
        audit_evolution_compliance_evidence_signals: 'agent:trust',
        publish_evolution_compliance_evidence_status: 'agent:ops'
    }
});

export function mapEvolutionComplianceEvidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionComplianceEvidenceMapperToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionComplianceEvidenceMapper extends BaseManager {}

export const __evolutionComplianceEvidenceMapperInternals = toolkit.internals;
