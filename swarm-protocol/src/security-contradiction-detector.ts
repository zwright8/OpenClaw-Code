import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_contradiction_detector',
    collectionField: 'claims',
    idField: 'claimId',
    defaultName: 'Security Claim',
    readyPosture: 'security_contradictions_managed',
    defaultAgentId: 'agent:security-contradictions',
    recommendationTypes: {
        primary: 'detect_security_contradictions',
        guard: 'mitigate_conflicting_security_claims',
        audit: 'audit_security_contradiction_signals',
        publish: 'publish_security_contradiction_status'
    },
    recommendationTargetMap: {
        detect_security_contradictions: 'agent:security',
        mitigate_conflicting_security_claims: 'agent:policy',
        audit_security_contradiction_signals: 'agent:trust',
        publish_security_contradiction_status: 'agent:ops'
    }
});

export function detectSecurityContradictions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityContradictionDetectorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityContradictionDetector extends BaseManager {}

export const __securityContradictionDetectorInternals = toolkit.internals;
