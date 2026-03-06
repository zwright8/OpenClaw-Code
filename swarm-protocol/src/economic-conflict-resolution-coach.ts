import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_conflict_resolution_coach',
    collectionField: 'conflicts',
    idField: 'conflictId',
    defaultName: 'Economic Conflict',
    readyPosture: 'economic_conflict_resolution_ready',
    defaultAgentId: 'agent:economic-conflict-resolution',
    recommendationTypes: {
        primary: 'coach_economic_conflict_resolution',
        guard: 'mitigate_economic_collaboration_deadlock',
        audit: 'audit_economic_conflict_signals',
        publish: 'publish_economic_conflict_resolution_status'
    },
    recommendationTargetMap: {
        coach_economic_conflict_resolution: 'agent:economic',
        mitigate_economic_collaboration_deadlock: 'agent:policy',
        audit_economic_conflict_signals: 'agent:trust',
        publish_economic_conflict_resolution_status: 'agent:ops'
    }
});

export function coachEconomicConflictResolution(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicConflictResolutionCoachToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicConflictResolutionCoach extends BaseManager {}

export const __economicConflictResolutionCoachInternals = toolkit.internals;
