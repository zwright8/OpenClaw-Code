import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_contradiction_detector',
    collectionField: 'claims',
    idField: 'claimId',
    defaultName: 'Oversight Claim',
    readyPosture: 'oversight_contradictions_managed',
    defaultAgentId: 'agent:oversight-contradictions',
    recommendationTypes: {
        primary: 'detect_oversight_contradictions',
        guard: 'mitigate_conflicting_oversight_claims',
        audit: 'audit_oversight_contradiction_signals',
        publish: 'publish_oversight_contradiction_status'
    },
    recommendationTargetMap: {
        detect_oversight_contradictions: 'agent:oversight',
        mitigate_conflicting_oversight_claims: 'agent:policy',
        audit_oversight_contradiction_signals: 'agent:trust',
        publish_oversight_contradiction_status: 'agent:ops'
    }
});

export function detectOversightContradictions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightContradictionDetectorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightContradictionDetector extends BaseManager {}

export const __oversightContradictionDetectorInternals = toolkit.internals;
