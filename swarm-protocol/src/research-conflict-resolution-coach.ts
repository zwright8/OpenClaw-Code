import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_conflict_resolution_coach',
    collectionField: 'conflicts',
    idField: 'conflictId',
    defaultName: 'Research Conflict',
    readyPosture: 'research_conflict_resolution_ready',
    defaultAgentId: 'agent:research-conflict-resolution',
    recommendationTypes: {
        primary: 'coach_research_conflict_resolution',
        guard: 'mitigate_research_collaboration_deadlock',
        audit: 'audit_research_conflict_signals',
        publish: 'publish_research_conflict_resolution_status'
    },
    recommendationTargetMap: {
        coach_research_conflict_resolution: 'agent:research',
        mitigate_research_collaboration_deadlock: 'agent:policy',
        audit_research_conflict_signals: 'agent:trust',
        publish_research_conflict_resolution_status: 'agent:ops'
    }
});

export function coachResearchConflictResolution(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchConflictResolutionCoachToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchConflictResolutionCoach extends BaseManager {}

export const __researchConflictResolutionCoachInternals = toolkit.internals;
