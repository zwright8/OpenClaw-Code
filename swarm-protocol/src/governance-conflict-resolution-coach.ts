import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_conflict_resolution_coach',
    collectionField: 'conflicts',
    idField: 'conflictId',
    defaultName: 'Governance Conflict',
    readyPosture: 'governance_conflict_resolution_ready',
    defaultAgentId: 'agent:governance-conflict-resolution',
    recommendationTypes: {
        primary: 'coach_governance_conflict_resolution',
        guard: 'mitigate_governance_collaboration_deadlock',
        audit: 'audit_governance_conflict_signals',
        publish: 'publish_governance_conflict_resolution_status'
    },
    recommendationTargetMap: {
        coach_governance_conflict_resolution: 'agent:governance',
        mitigate_governance_collaboration_deadlock: 'agent:policy',
        audit_governance_conflict_signals: 'agent:trust',
        publish_governance_conflict_resolution_status: 'agent:ops'
    }
});

export function coachGovernanceConflictResolution(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceConflictResolutionCoachToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceConflictResolutionCoach extends BaseManager {}

export const __governanceConflictResolutionCoachInternals = toolkit.internals;
