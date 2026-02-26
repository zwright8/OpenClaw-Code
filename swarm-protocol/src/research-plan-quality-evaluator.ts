import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_plan_quality_evaluator',
    collectionField: 'plans',
    idField: 'planId',
    defaultName: 'Research Plan',
    readyPosture: 'research_plan_quality_assured',
    defaultAgentId: 'agent:research-plan-quality',
    recommendationTypes: {
        primary: 'evaluate_research_plan_quality',
        guard: 'mitigate_research_plan_feasibility_risk',
        audit: 'audit_research_plan_quality_signals',
        publish: 'publish_research_plan_quality_status'
    },
    recommendationTargetMap: {
        evaluate_research_plan_quality: 'agent:research',
        mitigate_research_plan_feasibility_risk: 'agent:policy',
        audit_research_plan_quality_signals: 'agent:trust',
        publish_research_plan_quality_status: 'agent:ops'
    }
});

export function evaluateResearchPlanQuality(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchPlanQualityEvaluatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchPlanQualityEvaluator extends BaseManager {}

export const __researchPlanQualityEvaluatorInternals = toolkit.internals;
