import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'tooling_conflict_resolution_coach',
    collectionField: 'conflicts',
    idField: 'conflictId',
    defaultName: 'Conflict',
    readyPosture: 'conflict_resolution_stable',
    defaultAgentId: 'agent:tooling-conflict-coach',
    recommendationTypes: {
        primary: 'coach_conflict_resolution_path',
        guard: 'mitigate_collaboration_deadlock_risk',
        audit: 'audit_conflict_resolution_signals',
        publish: 'publish_conflict_resolution_status'
    },
    recommendationTargetMap: {
        coach_conflict_resolution_path: 'agent:collaboration',
        mitigate_collaboration_deadlock_risk: 'agent:governance',
        audit_conflict_resolution_signals: 'agent:trust',
        publish_conflict_resolution_status: 'agent:ops'
    }
});

export function coachToolingConflictResolution(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function toolingConflictResolutionCoachToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ToolingConflictResolutionCoach extends BaseManager {}

export const __toolingConflictResolutionCoachInternals = toolkit.internals;
