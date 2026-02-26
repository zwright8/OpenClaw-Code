import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_risk_aware_scheduler',
    collectionField: 'scheduleItems',
    idField: 'scheduleId',
    defaultName: 'Schedule Item',
    readyPosture: 'research_risk_schedule_ready',
    defaultAgentId: 'agent:research-scheduler',
    recommendationTypes: {
        primary: 'schedule_research_actions_by_risk',
        guard: 'mitigate_research_timing_risk',
        audit: 'audit_research_schedule_signals',
        publish: 'publish_research_schedule_status'
    },
    recommendationTargetMap: {
        schedule_research_actions_by_risk: 'agent:research',
        mitigate_research_timing_risk: 'agent:risk',
        audit_research_schedule_signals: 'agent:trust',
        publish_research_schedule_status: 'agent:ops'
    }
});

export function scheduleResearchRiskAware(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchRiskAwareSchedulerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchRiskAwareScheduler extends BaseManager {}

export const __researchRiskAwareSchedulerInternals = toolkit.internals;
