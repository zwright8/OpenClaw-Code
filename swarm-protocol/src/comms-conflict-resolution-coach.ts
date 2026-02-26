import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_conflict_resolution_coach',
    collectionField: 'conflicts',
    idField: 'conflictId',
    defaultName: 'Comms Conflict',
    readyPosture: 'comms_conflict_resolution_ready',
    defaultAgentId: 'agent:comms-conflict-resolution',
    recommendationTypes: {
        primary: 'coach_comms_conflict_resolution',
        guard: 'mitigate_comms_collaboration_deadlock',
        audit: 'audit_comms_conflict_signals',
        publish: 'publish_comms_conflict_resolution_status'
    },
    recommendationTargetMap: {
        coach_comms_conflict_resolution: 'agent:comms',
        mitigate_comms_collaboration_deadlock: 'agent:policy',
        audit_comms_conflict_signals: 'agent:trust',
        publish_comms_conflict_resolution_status: 'agent:ops'
    }
});

export function coachCommsConflictResolution(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsConflictResolutionCoachToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsConflictResolutionCoach extends BaseManager {}

export const __commsConflictResolutionCoachInternals = toolkit.internals;
