import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_conflict_resolution_coach',
    collectionField: 'conflicts',
    idField: 'conflictId',
    defaultName: 'Education Conflict',
    readyPosture: 'education_conflict_resolution_ready',
    defaultAgentId: 'agent:education-conflict-resolution',
    recommendationTypes: {
        primary: 'coach_education_conflict_resolution',
        guard: 'mitigate_education_collaboration_deadlock',
        audit: 'audit_education_conflict_signals',
        publish: 'publish_education_conflict_resolution_status'
    },
    recommendationTargetMap: {
        coach_education_conflict_resolution: 'agent:education',
        mitigate_education_collaboration_deadlock: 'agent:policy',
        audit_education_conflict_signals: 'agent:trust',
        publish_education_conflict_resolution_status: 'agent:ops'
    }
});

export function coachEducationConflictResolution(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationConflictResolutionCoachToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationConflictResolutionCoach extends BaseManager {}

export const __educationConflictResolutionCoachInternals = toolkit.internals;
