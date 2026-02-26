import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_conflict_resolution_coach',
    collectionField: 'conflicts',
    idField: 'conflictId',
    defaultName: 'Crisis Conflict',
    readyPosture: 'crisis_conflict_resolution_ready',
    defaultAgentId: 'agent:crisis-conflict-resolution',
    recommendationTypes: {
        primary: 'coach_crisis_conflict_resolution',
        guard: 'mitigate_crisis_collaboration_deadlock',
        audit: 'audit_crisis_conflict_signals',
        publish: 'publish_crisis_conflict_resolution_status'
    },
    recommendationTargetMap: {
        coach_crisis_conflict_resolution: 'agent:crisis',
        mitigate_crisis_collaboration_deadlock: 'agent:policy',
        audit_crisis_conflict_signals: 'agent:trust',
        publish_crisis_conflict_resolution_status: 'agent:ops'
    }
});

export function coachCrisisConflictResolution(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisConflictResolutionCoachToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisConflictResolutionCoach extends BaseManager {}

export const __crisisConflictResolutionCoachInternals = toolkit.internals;
