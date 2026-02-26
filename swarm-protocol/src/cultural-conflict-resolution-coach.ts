import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_conflict_resolution_coach',
    collectionField: 'conflicts',
    idField: 'conflictId',
    defaultName: 'Cultural Conflict',
    readyPosture: 'cultural_conflict_resolution_ready',
    defaultAgentId: 'agent:cultural-conflict-resolution',
    recommendationTypes: {
        primary: 'coach_cultural_conflict_resolution',
        guard: 'mitigate_cultural_conflict_escalation',
        audit: 'audit_cultural_conflict_resolution_signals',
        publish: 'publish_cultural_conflict_resolution_status'
    },
    recommendationTargetMap: {
        coach_cultural_conflict_resolution: 'agent:cultural',
        mitigate_cultural_conflict_escalation: 'agent:policy',
        audit_cultural_conflict_resolution_signals: 'agent:trust',
        publish_cultural_conflict_resolution_status: 'agent:ops'
    }
});

export function coachCulturalConflictResolution(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalConflictResolutionCoachToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalConflictResolutionCoach extends BaseManager {}

export const __culturalConflictResolutionCoachInternals = toolkit.internals;
