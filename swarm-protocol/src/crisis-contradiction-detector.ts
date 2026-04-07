import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_contradiction_detector',
    collectionField: 'claims',
    idField: 'claimId',
    defaultName: 'Crisis Claim',
    readyPosture: 'crisis_contradictions_managed',
    defaultAgentId: 'agent:crisis-contradictions',
    recommendationTypes: {
        primary: 'detect_crisis_contradictions',
        guard: 'mitigate_conflicting_crisis_claims',
        audit: 'audit_crisis_contradiction_signals',
        publish: 'publish_crisis_contradiction_status'
    },
    recommendationTargetMap: {
        detect_crisis_contradictions: 'agent:crisis',
        mitigate_conflicting_crisis_claims: 'agent:policy',
        audit_crisis_contradiction_signals: 'agent:trust',
        publish_crisis_contradiction_status: 'agent:ops'
    }
});

export function detectCrisisContradictions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisContradictionDetectorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisContradictionDetector extends BaseManager {}

export const __crisisContradictionDetectorInternals = toolkit.internals;
