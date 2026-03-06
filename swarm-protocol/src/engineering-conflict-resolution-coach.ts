import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_conflict_resolution_coach',
    collectionField: 'conflicts',
    idField: 'conflictId',
    defaultName: 'Engineering Conflict',
    readyPosture: 'engineering_conflict_resolution_ready',
    defaultAgentId: 'agent:engineering-conflict-resolution',
    recommendationTypes: {
        primary: 'coach_engineering_conflict_resolution',
        guard: 'mitigate_engineering_collaboration_deadlock',
        audit: 'audit_engineering_conflict_signals',
        publish: 'publish_engineering_conflict_resolution_status'
    },
    recommendationTargetMap: {
        coach_engineering_conflict_resolution: 'agent:engineering',
        mitigate_engineering_collaboration_deadlock: 'agent:policy',
        audit_engineering_conflict_signals: 'agent:trust',
        publish_engineering_conflict_resolution_status: 'agent:ops'
    }
});

export function coachEngineeringConflictResolution(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringConflictResolutionCoachToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringConflictResolutionCoach extends BaseManager {}

export const __engineeringConflictResolutionCoachInternals = toolkit.internals;
