import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_conflict_resolution_coach',
    collectionField: 'conflicts',
    idField: 'conflictId',
    defaultName: 'Impact Conflict',
    readyPosture: 'impact_conflict_resolution_ready',
    defaultAgentId: 'agent:impact-conflict-resolution',
    recommendationTypes: {
        primary: 'coach_impact_conflict_resolution',
        guard: 'mitigate_impact_collaboration_deadlock',
        audit: 'audit_impact_conflict_signals',
        publish: 'publish_impact_conflict_resolution_status'
    },
    recommendationTargetMap: {
        coach_impact_conflict_resolution: 'agent:impact',
        mitigate_impact_collaboration_deadlock: 'agent:policy',
        audit_impact_conflict_signals: 'agent:trust',
        publish_impact_conflict_resolution_status: 'agent:ops'
    }
});

export function coachImpactConflictResolution(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactConflictResolutionCoachToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactConflictResolutionCoach extends BaseManager {}

export const __impactConflictResolutionCoachInternals = toolkit.internals;
