import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_contradiction_detector',
    collectionField: 'claims',
    idField: 'claimId',
    defaultName: 'Impact Claim',
    readyPosture: 'impact_contradictions_managed',
    defaultAgentId: 'agent:impact-contradictions',
    recommendationTypes: {
        primary: 'detect_impact_contradictions',
        guard: 'mitigate_conflicting_impact_claims',
        audit: 'audit_impact_contradiction_signals',
        publish: 'publish_impact_contradiction_status'
    },
    recommendationTargetMap: {
        detect_impact_contradictions: 'agent:impact',
        mitigate_conflicting_impact_claims: 'agent:policy',
        audit_impact_contradiction_signals: 'agent:trust',
        publish_impact_contradiction_status: 'agent:ops'
    }
});

export function detectImpactContradictions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactContradictionDetectorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactContradictionDetector extends BaseManager {}

export const __impactContradictionDetectorInternals = toolkit.internals;
