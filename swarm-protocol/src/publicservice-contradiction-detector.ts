import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_contradiction_detector',
    collectionField: 'claims',
    idField: 'claimId',
    defaultName: 'PublicService Claim',
    readyPosture: 'publicservice_contradictions_managed',
    defaultAgentId: 'agent:publicservice-contradictions',
    recommendationTypes: {
        primary: 'detect_publicservice_contradictions',
        guard: 'mitigate_conflicting_publicservice_claims',
        audit: 'audit_publicservice_contradiction_signals',
        publish: 'publish_publicservice_contradiction_status'
    },
    recommendationTargetMap: {
        detect_publicservice_contradictions: 'agent:publicservice',
        mitigate_conflicting_publicservice_claims: 'agent:policy',
        audit_publicservice_contradiction_signals: 'agent:trust',
        publish_publicservice_contradiction_status: 'agent:ops'
    }
});

export function detectPublicServiceContradictions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceContradictionDetectorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceContradictionDetector extends BaseManager {}

export const __publicServiceContradictionDetectorInternals = toolkit.internals;
