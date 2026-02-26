import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_cost_benefit_forecaster',
    collectionField: 'initiatives',
    idField: 'initiativeId',
    defaultName: 'Research Initiative',
    readyPosture: 'research_cost_benefit_forecast_ready',
    defaultAgentId: 'agent:research-cost-benefit',
    recommendationTypes: {
        primary: 'forecast_research_cost_benefit',
        guard: 'mitigate_research_negative_roi_risk',
        audit: 'audit_research_cost_benefit_signals',
        publish: 'publish_research_cost_benefit_status'
    },
    recommendationTargetMap: {
        forecast_research_cost_benefit: 'agent:finance',
        mitigate_research_negative_roi_risk: 'agent:planning',
        audit_research_cost_benefit_signals: 'agent:trust',
        publish_research_cost_benefit_status: 'agent:ops'
    }
});

export function forecastResearchCostBenefit(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchCostBenefitForecasterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchCostBenefitForecaster extends BaseManager {}

export const __researchCostBenefitForecasterInternals = toolkit.internals;
