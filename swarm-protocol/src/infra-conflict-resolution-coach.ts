import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_conflict_resolution_coach',
    collectionField: 'conflicts',
    idField: 'conflictId',
    defaultName: 'Infra Conflict',
    readyPosture: 'infra_conflict_resolution_ready',
    defaultAgentId: 'agent:infra-conflict-resolution',
    recommendationTypes: {
        primary: 'coach_infra_conflict_resolution',
        guard: 'mitigate_infra_collaboration_deadlock',
        audit: 'audit_infra_conflict_signals',
        publish: 'publish_infra_conflict_resolution_status'
    },
    recommendationTargetMap: {
        coach_infra_conflict_resolution: 'agent:infra',
        mitigate_infra_collaboration_deadlock: 'agent:policy',
        audit_infra_conflict_signals: 'agent:trust',
        publish_infra_conflict_resolution_status: 'agent:ops'
    }
});

export function coachInfraConflictResolution(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraConflictResolutionCoachToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraConflictResolutionCoach extends BaseManager {}

export const __infraConflictResolutionCoachInternals = toolkit.internals;
