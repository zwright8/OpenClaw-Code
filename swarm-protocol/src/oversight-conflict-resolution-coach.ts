import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_conflict_resolution_coach',
    collectionField: 'conflicts',
    idField: 'conflictId',
    defaultName: 'Oversight Conflict',
    readyPosture: 'oversight_conflict_resolution_ready',
    defaultAgentId: 'agent:oversight-conflict-resolution',
    recommendationTypes: {
        primary: 'coach_oversight_conflict_resolution',
        guard: 'mitigate_oversight_collaboration_deadlock',
        audit: 'audit_oversight_conflict_signals',
        publish: 'publish_oversight_conflict_resolution_status'
    },
    recommendationTargetMap: {
        coach_oversight_conflict_resolution: 'agent:oversight',
        mitigate_oversight_collaboration_deadlock: 'agent:policy',
        audit_oversight_conflict_signals: 'agent:trust',
        publish_oversight_conflict_resolution_status: 'agent:ops'
    }
});

export function coachOversightConflictResolution(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightConflictResolutionCoachToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightConflictResolutionCoach extends BaseManager {}

export const __oversightConflictResolutionCoachInternals = toolkit.internals;
