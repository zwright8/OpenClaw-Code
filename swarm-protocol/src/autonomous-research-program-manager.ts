import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'autonomous_research_program_manager',
    collectionField: 'programs',
    idField: 'programId',
    defaultName: 'Program',
    readyPosture: 'research_programs_balanced',
    defaultAgentId: 'agent:research-program-manager',
    recommendationTypes: {
        primary: 'schedule_research_program_lane',
        guard: 'rebalance_research_program_risk',
        audit: 'audit_program_execution_signals',
        publish: 'publish_research_program_brief'
    },
    recommendationTargetMap: {
        schedule_research_program_lane: 'agent:research-ops',
        rebalance_research_program_risk: 'agent:planning',
        audit_program_execution_signals: 'agent:quality',
        publish_research_program_brief: 'agent:ops'
    }
});

export function manageAutonomousResearchPrograms(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function autonomousResearchProgramToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class AutonomousResearchProgramManager extends BaseManager {}

export const __autonomousResearchProgramManagerInternals = toolkit.internals;
