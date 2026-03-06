import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_cost_benefit_forecaster',
    collectionField: 'initiatives',
    idField: 'initiativeId',
    defaultName: 'Economic Initiative',
    readyPosture: 'economic_cost_benefit_forecast_ready',
    defaultAgentId: 'agent:economic-cost-benefit',
    recommendationTypes: {
        primary: 'forecast_economic_cost_benefit',
        guard: 'mitigate_economic_negative_roi_risk',
        audit: 'audit_economic_cost_benefit_signals',
        publish: 'publish_economic_cost_benefit_status'
    },
    recommendationTargetMap: {
        forecast_economic_cost_benefit: 'agent:finance',
        mitigate_economic_negative_roi_risk: 'agent:planning',
        audit_economic_cost_benefit_signals: 'agent:trust',
        publish_economic_cost_benefit_status: 'agent:ops'
    }
});

export function forecastEconomicCostBenefit(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicCostBenefitForecasterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicCostBenefitForecaster extends BaseManager {}

export const __economicCostBenefitForecasterInternals = toolkit.internals;
