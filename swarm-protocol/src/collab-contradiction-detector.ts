import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_contradiction_detector',
    collectionField: 'claims',
    idField: 'claimId',
    defaultName: 'Collab Claim',
    readyPosture: 'collab_contradictions_managed',
    defaultAgentId: 'agent:collab-contradictions',
    recommendationTypes: {
        primary: 'detect_collab_contradictions',
        guard: 'mitigate_conflicting_collab_claims',
        audit: 'audit_collab_contradiction_signals',
        publish: 'publish_collab_contradiction_status'
    },
    recommendationTargetMap: {
        detect_collab_contradictions: 'agent:collab',
        mitigate_conflicting_collab_claims: 'agent:policy',
        audit_collab_contradiction_signals: 'agent:trust',
        publish_collab_contradiction_status: 'agent:ops'
    }
});

export function detectCollabContradictions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabContradictionDetectorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabContradictionDetector extends BaseManager {}

export const __collabContradictionDetectorInternals = toolkit.internals;
