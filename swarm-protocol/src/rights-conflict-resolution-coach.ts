import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_conflict_resolution_coach',
    collectionField: 'conflicts',
    idField: 'conflictId',
    defaultName: 'Rights Conflict',
    readyPosture: 'rights_conflict_resolution_ready',
    defaultAgentId: 'agent:rights-conflict-resolution',
    recommendationTypes: {
        primary: 'coach_rights_conflict_resolution',
        guard: 'mitigate_rights_collaboration_deadlock',
        audit: 'audit_rights_conflict_signals',
        publish: 'publish_rights_conflict_resolution_status'
    },
    recommendationTargetMap: {
        coach_rights_conflict_resolution: 'agent:rights',
        mitigate_rights_collaboration_deadlock: 'agent:policy',
        audit_rights_conflict_signals: 'agent:trust',
        publish_rights_conflict_resolution_status: 'agent:ops'
    }
});

export function coachRightsConflictResolution(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsConflictResolutionCoachToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsConflictResolutionCoach extends BaseManager {}

export const __rightsConflictResolutionCoachInternals = toolkit.internals;
