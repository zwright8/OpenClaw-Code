import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_conflict_resolution_coach',
    collectionField: 'conflicts',
    idField: 'conflictId',
    defaultName: 'Evolution Conflict',
    readyPosture: 'evolution_conflict_resolution_ready',
    defaultAgentId: 'agent:evolution-conflict-resolution',
    recommendationTypes: {
        primary: 'coach_evolution_conflict_resolution',
        guard: 'mitigate_evolution_collaboration_deadlock',
        audit: 'audit_evolution_conflict_signals',
        publish: 'publish_evolution_conflict_resolution_status'
    },
    recommendationTargetMap: {
        coach_evolution_conflict_resolution: 'agent:evolution',
        mitigate_evolution_collaboration_deadlock: 'agent:policy',
        audit_evolution_conflict_signals: 'agent:trust',
        publish_evolution_conflict_resolution_status: 'agent:ops'
    }
});

export function coachEvolutionConflictResolution(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionConflictResolutionCoachToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionConflictResolutionCoach extends BaseManager {}

export const __evolutionConflictResolutionCoachInternals = toolkit.internals;
