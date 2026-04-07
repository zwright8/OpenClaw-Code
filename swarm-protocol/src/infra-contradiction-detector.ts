import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_contradiction_detector',
    collectionField: 'claims',
    idField: 'claimId',
    defaultName: 'Infra Claim',
    readyPosture: 'infra_contradictions_managed',
    defaultAgentId: 'agent:infra-contradictions',
    recommendationTypes: {
        primary: 'detect_infra_contradictions',
        guard: 'mitigate_conflicting_infra_claims',
        audit: 'audit_infra_contradiction_signals',
        publish: 'publish_infra_contradiction_status'
    },
    recommendationTargetMap: {
        detect_infra_contradictions: 'agent:infra',
        mitigate_conflicting_infra_claims: 'agent:policy',
        audit_infra_contradiction_signals: 'agent:trust',
        publish_infra_contradiction_status: 'agent:ops'
    }
});

export function detectInfraContradictions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraContradictionDetectorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraContradictionDetector extends BaseManager {}

export const __infraContradictionDetectorInternals = toolkit.internals;
