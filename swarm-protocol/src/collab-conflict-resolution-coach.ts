import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_conflict_resolution_coach',
    collectionField: 'conflicts',
    idField: 'conflictId',
    defaultName: 'Collab Conflict',
    readyPosture: 'collab_conflict_resolution_ready',
    defaultAgentId: 'agent:collab-conflict-resolution',
    recommendationTypes: {
        primary: 'coach_collab_conflict_resolution',
        guard: 'mitigate_collab_collaboration_deadlock',
        audit: 'audit_collab_conflict_signals',
        publish: 'publish_collab_conflict_resolution_status'
    },
    recommendationTargetMap: {
        coach_collab_conflict_resolution: 'agent:collab',
        mitigate_collab_collaboration_deadlock: 'agent:policy',
        audit_collab_conflict_signals: 'agent:trust',
        publish_collab_conflict_resolution_status: 'agent:ops'
    }
});

export function coachCollabConflictResolution(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabConflictResolutionCoachToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabConflictResolutionCoach extends BaseManager {}

export const __collabConflictResolutionCoachInternals = toolkit.internals;
