import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_failure_root_cause_miner',
    collectionField: 'failures',
    idField: 'failureId',
    defaultName: 'Research Failure',
    readyPosture: 'research_root_cause_ready',
    defaultAgentId: 'agent:research-root-cause',
    recommendationTypes: {
        primary: 'mine_research_failure_root_causes',
        guard: 'mitigate_research_repeat_failure',
        audit: 'audit_research_root_cause_signals',
        publish: 'publish_research_root_cause_status'
    },
    recommendationTargetMap: {
        mine_research_failure_root_causes: 'agent:research',
        mitigate_research_repeat_failure: 'agent:reliability',
        audit_research_root_cause_signals: 'agent:trust',
        publish_research_root_cause_status: 'agent:ops'
    }
});

export function mineResearchFailureRootCauses(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchFailureRootCauseMinerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchFailureRootCauseMiner extends BaseManager {}

export const __researchFailureRootCauseMinerInternals = toolkit.internals;
