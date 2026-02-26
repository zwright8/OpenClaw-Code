import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_contradiction_detector',
    collectionField: 'claims',
    idField: 'claimId',
    defaultName: 'Federation Claim',
    readyPosture: 'federation_contradictions_managed',
    defaultAgentId: 'agent:federation-contradictions',
    recommendationTypes: {
        primary: 'detect_federation_contradictions',
        guard: 'mitigate_conflicting_federation_claims',
        audit: 'audit_federation_contradiction_signals',
        publish: 'publish_federation_contradiction_status'
    },
    recommendationTargetMap: {
        detect_federation_contradictions: 'agent:federation',
        mitigate_conflicting_federation_claims: 'agent:policy',
        audit_federation_contradiction_signals: 'agent:trust',
        publish_federation_contradiction_status: 'agent:ops'
    }
});

export function detectFederationContradictions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationContradictionDetectorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationContradictionDetector extends BaseManager {}

export const __federationContradictionDetectorInternals = toolkit.internals;
