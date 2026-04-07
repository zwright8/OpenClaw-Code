import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_contradiction_detector',
    collectionField: 'claims',
    idField: 'claimId',
    defaultName: 'Inclusion Claim',
    readyPosture: 'inclusion_contradictions_managed',
    defaultAgentId: 'agent:inclusion-contradictions',
    recommendationTypes: {
        primary: 'detect_inclusion_contradictions',
        guard: 'mitigate_conflicting_inclusion_claims',
        audit: 'audit_inclusion_contradiction_signals',
        publish: 'publish_inclusion_contradiction_status'
    },
    recommendationTargetMap: {
        detect_inclusion_contradictions: 'agent:inclusion',
        mitigate_conflicting_inclusion_claims: 'agent:policy',
        audit_inclusion_contradiction_signals: 'agent:trust',
        publish_inclusion_contradiction_status: 'agent:ops'
    }
});

export function detectInclusionContradictions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionContradictionDetectorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionContradictionDetector extends BaseManager {}

export const __inclusionContradictionDetectorInternals = toolkit.internals;
