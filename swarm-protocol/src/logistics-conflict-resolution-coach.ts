import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_conflict_resolution_coach',
    collectionField: 'conflicts',
    idField: 'conflictId',
    defaultName: 'Logistics Conflict',
    readyPosture: 'logistics_conflict_resolution_ready',
    defaultAgentId: 'agent:logistics-conflict-resolution',
    recommendationTypes: {
        primary: 'coach_logistics_conflict_resolution',
        guard: 'mitigate_logistics_collaboration_deadlock',
        audit: 'audit_logistics_conflict_signals',
        publish: 'publish_logistics_conflict_resolution_status'
    },
    recommendationTargetMap: {
        coach_logistics_conflict_resolution: 'agent:logistics',
        mitigate_logistics_collaboration_deadlock: 'agent:policy',
        audit_logistics_conflict_signals: 'agent:trust',
        publish_logistics_conflict_resolution_status: 'agent:ops'
    }
});

export function coachLogisticsConflictResolution(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsConflictResolutionCoachToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsConflictResolutionCoach extends BaseManager {}

export const __logisticsConflictResolutionCoachInternals = toolkit.internals;
