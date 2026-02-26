import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_conflict_resolution_coach',
    collectionField: 'conflicts',
    idField: 'conflictId',
    defaultName: 'Security Conflict',
    readyPosture: 'security_conflict_resolution_ready',
    defaultAgentId: 'agent:security-conflict-resolution',
    recommendationTypes: {
        primary: 'coach_security_conflict_resolution',
        guard: 'mitigate_security_collaboration_deadlock',
        audit: 'audit_security_conflict_signals',
        publish: 'publish_security_conflict_resolution_status'
    },
    recommendationTargetMap: {
        coach_security_conflict_resolution: 'agent:security',
        mitigate_security_collaboration_deadlock: 'agent:policy',
        audit_security_conflict_signals: 'agent:trust',
        publish_security_conflict_resolution_status: 'agent:ops'
    }
});

export function coachSecurityConflictResolution(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityConflictResolutionCoachToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityConflictResolutionCoach extends BaseManager {}

export const __securityConflictResolutionCoachInternals = toolkit.internals;
