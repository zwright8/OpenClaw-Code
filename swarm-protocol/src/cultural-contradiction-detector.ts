import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_contradiction_detector',
    collectionField: 'claims',
    idField: 'claimId',
    defaultName: 'Cultural Claim',
    readyPosture: 'cultural_contradictions_managed',
    defaultAgentId: 'agent:cultural-contradictions',
    recommendationTypes: {
        primary: 'detect_cultural_contradictions',
        guard: 'mitigate_conflicting_cultural_claims',
        audit: 'audit_cultural_contradiction_signals',
        publish: 'publish_cultural_contradiction_status'
    },
    recommendationTargetMap: {
        detect_cultural_contradictions: 'agent:cultural',
        mitigate_conflicting_cultural_claims: 'agent:policy',
        audit_cultural_contradiction_signals: 'agent:trust',
        publish_cultural_contradiction_status: 'agent:ops'
    }
});

export function detectCulturalContradictions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalContradictionDetectorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalContradictionDetector extends BaseManager {}

export const __culturalContradictionDetectorInternals = toolkit.internals;
