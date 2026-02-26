import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_contradiction_detector',
    collectionField: 'claims',
    idField: 'claimId',
    defaultName: 'Engineering Claim',
    readyPosture: 'engineering_contradictions_managed',
    defaultAgentId: 'agent:engineering-contradictions',
    recommendationTypes: {
        primary: 'detect_engineering_contradictions',
        guard: 'mitigate_conflicting_engineering_claims',
        audit: 'audit_engineering_contradiction_signals',
        publish: 'publish_engineering_contradiction_status'
    },
    recommendationTargetMap: {
        detect_engineering_contradictions: 'agent:engineering',
        mitigate_conflicting_engineering_claims: 'agent:policy',
        audit_engineering_contradiction_signals: 'agent:trust',
        publish_engineering_contradiction_status: 'agent:ops'
    }
});

export function detectEngineeringContradictions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringContradictionDetectorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringContradictionDetector extends BaseManager {}

export const __engineeringContradictionDetectorInternals = toolkit.internals;
