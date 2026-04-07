import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_contradiction_detector',
    collectionField: 'claims',
    idField: 'claimId',
    defaultName: 'Comms Claim',
    readyPosture: 'comms_contradictions_managed',
    defaultAgentId: 'agent:comms-contradictions',
    recommendationTypes: {
        primary: 'detect_comms_contradictions',
        guard: 'mitigate_conflicting_comms_claims',
        audit: 'audit_comms_contradiction_signals',
        publish: 'publish_comms_contradiction_status'
    },
    recommendationTargetMap: {
        detect_comms_contradictions: 'agent:comms',
        mitigate_conflicting_comms_claims: 'agent:policy',
        audit_comms_contradiction_signals: 'agent:trust',
        publish_comms_contradiction_status: 'agent:ops'
    }
});

export function detectCommsContradictions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsContradictionDetectorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsContradictionDetector extends BaseManager {}

export const __commsContradictionDetectorInternals = toolkit.internals;
