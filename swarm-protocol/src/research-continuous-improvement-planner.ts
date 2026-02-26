import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_continuous_improvement_planner',
    collectionField: 'improvements',
    idField: 'improvementId',
    defaultName: 'Research Improvement',
    readyPosture: 'research_continuous_improvement_planned',
    defaultAgentId: 'agent:research-continuous-improvement',
    recommendationTypes: {
        primary: 'plan_continuous_research_improvement',
        guard: 'mitigate_research_improvement_backlog_risk',
        audit: 'audit_research_continuous_improvement_signals',
        publish: 'publish_research_continuous_improvement_status'
    },
    recommendationTargetMap: {
        plan_continuous_research_improvement: 'agent:strategy',
        mitigate_research_improvement_backlog_risk: 'agent:operations',
        audit_research_continuous_improvement_signals: 'agent:trust',
        publish_research_continuous_improvement_status: 'agent:ops'
    }
});

export function planResearchContinuousImprovement(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchContinuousImprovementPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchContinuousImprovementPlanner extends BaseManager {}

export const __researchContinuousImprovementPlannerInternals = toolkit.internals;
