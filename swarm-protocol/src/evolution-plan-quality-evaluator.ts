import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_plan_quality_evaluator',
    collectionField: 'plans',
    idField: 'planId',
    defaultName: 'Evolution Plan',
    readyPosture: 'evolution_plan_quality_assured',
    defaultAgentId: 'agent:evolution-plan-quality',
    recommendationTypes: {
        primary: 'evaluate_evolution_plan_quality',
        guard: 'mitigate_evolution_plan_feasibility_risk',
        audit: 'audit_evolution_plan_quality_signals',
        publish: 'publish_evolution_plan_quality_status'
    },
    recommendationTargetMap: {
        evaluate_evolution_plan_quality: 'agent:evolution',
        mitigate_evolution_plan_feasibility_risk: 'agent:policy',
        audit_evolution_plan_quality_signals: 'agent:trust',
        publish_evolution_plan_quality_status: 'agent:ops'
    }
});

export function evaluateEvolutionPlanQuality(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionPlanQualityEvaluatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionPlanQualityEvaluator extends BaseManager {}

export const __evolutionPlanQualityEvaluatorInternals = toolkit.internals;
