import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_conflict_resolution_coach',
    collectionField: 'conflicts',
    idField: 'conflictId',
    defaultName: 'Community Conflict',
    readyPosture: 'community_conflict_resolution_ready',
    defaultAgentId: 'agent:community-conflict-resolution',
    recommendationTypes: {
        primary: 'coach_community_conflict_resolution',
        guard: 'mitigate_community_conflict_escalation',
        audit: 'audit_community_conflict_resolution_signals',
        publish: 'publish_community_conflict_resolution_status'
    },
    recommendationTargetMap: {
        coach_community_conflict_resolution: 'agent:community',
        mitigate_community_conflict_escalation: 'agent:policy',
        audit_community_conflict_resolution_signals: 'agent:trust',
        publish_community_conflict_resolution_status: 'agent:ops'
    }
});

export function coachCommunityConflictResolution(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityConflictResolutionCoachToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityConflictResolutionCoach extends BaseManager {}

export const __communityConflictResolutionCoachInternals = toolkit.internals;
