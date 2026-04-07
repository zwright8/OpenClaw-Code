import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_cost_benefit_forecaster',
    collectionField: 'initiatives',
    idField: 'initiativeId',
    defaultName: 'Impact Initiative',
    readyPosture: 'impact_cost_benefit_forecast_ready',
    defaultAgentId: 'agent:impact-cost-benefit',
    recommendationTypes: {
        primary: 'forecast_impact_cost_benefit',
        guard: 'mitigate_impact_negative_roi_risk',
        audit: 'audit_impact_cost_benefit_signals',
        publish: 'publish_impact_cost_benefit_status'
    },
    recommendationTargetMap: {
        forecast_impact_cost_benefit: 'agent:finance',
        mitigate_impact_negative_roi_risk: 'agent:planning',
        audit_impact_cost_benefit_signals: 'agent:trust',
        publish_impact_cost_benefit_status: 'agent:ops'
    }
});

export function forecastImpactCostBenefit(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactCostBenefitForecasterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactCostBenefitForecaster extends BaseManager {}

export const __impactCostBenefitForecasterInternals = toolkit.internals;
