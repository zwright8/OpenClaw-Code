import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_conflict_resolution_coach',
    collectionField: 'conflicts',
    idField: 'conflictId',
    defaultName: 'Inclusion Conflict',
    readyPosture: 'inclusion_conflict_resolution_ready',
    defaultAgentId: 'agent:inclusion-conflict-resolution',
    recommendationTypes: {
        primary: 'coach_inclusion_conflict_resolution',
        guard: 'mitigate_inclusion_conflict_escalation',
        audit: 'audit_inclusion_conflict_resolution_signals',
        publish: 'publish_inclusion_conflict_resolution_status'
    },
    recommendationTargetMap: {
        coach_inclusion_conflict_resolution: 'agent:inclusion',
        mitigate_inclusion_conflict_escalation: 'agent:policy',
        audit_inclusion_conflict_resolution_signals: 'agent:trust',
        publish_inclusion_conflict_resolution_status: 'agent:ops'
    }
});

export function coachInclusionConflictResolution(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionConflictResolutionCoachToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionConflictResolutionCoach extends BaseManager {}

export const __inclusionConflictResolutionCoachInternals = toolkit.internals;
