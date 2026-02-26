import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_conflict_resolution_coach',
    collectionField: 'conflicts',
    idField: 'conflictId',
    defaultName: 'Observability Conflict',
    readyPosture: 'observability_conflict_resolution_ready',
    defaultAgentId: 'agent:observability-conflict-resolution',
    recommendationTypes: {
        primary: 'coach_observability_conflict_resolution',
        guard: 'mitigate_observability_collaboration_deadlock',
        audit: 'audit_observability_conflict_signals',
        publish: 'publish_observability_conflict_resolution_status'
    },
    recommendationTargetMap: {
        coach_observability_conflict_resolution: 'agent:observability',
        mitigate_observability_collaboration_deadlock: 'agent:policy',
        audit_observability_conflict_signals: 'agent:trust',
        publish_observability_conflict_resolution_status: 'agent:ops'
    }
});

export function coachObservabilityConflictResolution(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityConflictResolutionCoachToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityConflictResolutionCoach extends BaseManager {}

export const __observabilityConflictResolutionCoachInternals = toolkit.internals;
