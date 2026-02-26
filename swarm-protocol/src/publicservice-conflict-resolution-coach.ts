import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_conflict_resolution_coach',
    collectionField: 'conflicts',
    idField: 'conflictId',
    defaultName: 'PublicService Conflict',
    readyPosture: 'publicservice_conflict_resolution_ready',
    defaultAgentId: 'agent:publicservice-conflict-resolution',
    recommendationTypes: {
        primary: 'coach_publicservice_conflict_resolution',
        guard: 'mitigate_publicservice_collaboration_deadlock',
        audit: 'audit_publicservice_conflict_signals',
        publish: 'publish_publicservice_conflict_resolution_status'
    },
    recommendationTargetMap: {
        coach_publicservice_conflict_resolution: 'agent:publicservice',
        mitigate_publicservice_collaboration_deadlock: 'agent:policy',
        audit_publicservice_conflict_signals: 'agent:trust',
        publish_publicservice_conflict_resolution_status: 'agent:ops'
    }
});

export function coachPublicServiceConflictResolution(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceConflictResolutionCoachToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceConflictResolutionCoach extends BaseManager {}

export const __publicServiceConflictResolutionCoachInternals = toolkit.internals;
