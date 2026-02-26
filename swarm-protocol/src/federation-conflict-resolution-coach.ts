import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_conflict_resolution_coach',
    collectionField: 'conflicts',
    idField: 'conflictId',
    defaultName: 'Federation Conflict',
    readyPosture: 'federation_conflict_resolution_ready',
    defaultAgentId: 'agent:federation-conflict-resolution',
    recommendationTypes: {
        primary: 'coach_federation_conflict_resolution',
        guard: 'mitigate_federation_collaboration_deadlock',
        audit: 'audit_federation_conflict_signals',
        publish: 'publish_federation_conflict_resolution_status'
    },
    recommendationTargetMap: {
        coach_federation_conflict_resolution: 'agent:federation',
        mitigate_federation_collaboration_deadlock: 'agent:policy',
        audit_federation_conflict_signals: 'agent:trust',
        publish_federation_conflict_resolution_status: 'agent:ops'
    }
});

export function coachFederationConflictResolution(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationConflictResolutionCoachToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationConflictResolutionCoach extends BaseManager {}

export const __federationConflictResolutionCoachInternals = toolkit.internals;
