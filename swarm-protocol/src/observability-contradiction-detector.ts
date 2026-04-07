import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_contradiction_detector',
    collectionField: 'claims',
    idField: 'claimId',
    defaultName: 'Observability Claim',
    readyPosture: 'observability_contradictions_managed',
    defaultAgentId: 'agent:observability-contradictions',
    recommendationTypes: {
        primary: 'detect_observability_contradictions',
        guard: 'mitigate_conflicting_observability_claims',
        audit: 'audit_observability_contradiction_signals',
        publish: 'publish_observability_contradiction_status'
    },
    recommendationTargetMap: {
        detect_observability_contradictions: 'agent:observability',
        mitigate_conflicting_observability_claims: 'agent:policy',
        audit_observability_contradiction_signals: 'agent:trust',
        publish_observability_contradiction_status: 'agent:ops'
    }
});

export function detectObservabilityContradictions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityContradictionDetectorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityContradictionDetector extends BaseManager {}

export const __observabilityContradictionDetectorInternals = toolkit.internals;
