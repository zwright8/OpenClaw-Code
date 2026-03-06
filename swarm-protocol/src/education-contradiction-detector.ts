import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_contradiction_detector',
    collectionField: 'claims',
    idField: 'claimId',
    defaultName: 'Education Claim',
    readyPosture: 'education_contradictions_managed',
    defaultAgentId: 'agent:education-contradictions',
    recommendationTypes: {
        primary: 'detect_education_contradictions',
        guard: 'mitigate_conflicting_education_claims',
        audit: 'audit_education_contradiction_signals',
        publish: 'publish_education_contradiction_status'
    },
    recommendationTargetMap: {
        detect_education_contradictions: 'agent:education',
        mitigate_conflicting_education_claims: 'agent:policy',
        audit_education_contradiction_signals: 'agent:trust',
        publish_education_contradiction_status: 'agent:ops'
    }
});

export function detectEducationContradictions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationContradictionDetectorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationContradictionDetector extends BaseManager {}

export const __educationContradictionDetectorInternals = toolkit.internals;
