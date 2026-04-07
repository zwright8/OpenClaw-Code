import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_cost_benefit_forecaster',
    collectionField: 'initiatives',
    idField: 'initiativeId',
    defaultName: 'Cultural Initiative',
    readyPosture: 'cultural_cost_benefit_forecast_ready',
    defaultAgentId: 'agent:cultural-cost-benefit',
    recommendationTypes: {
        primary: 'forecast_cultural_cost_benefit',
        guard: 'mitigate_cultural_negative_roi_risk',
        audit: 'audit_cultural_cost_benefit_signals',
        publish: 'publish_cultural_cost_benefit_status'
    },
    recommendationTargetMap: {
        forecast_cultural_cost_benefit: 'agent:finance',
        mitigate_cultural_negative_roi_risk: 'agent:planning',
        audit_cultural_cost_benefit_signals: 'agent:trust',
        publish_cultural_cost_benefit_status: 'agent:ops'
    }
});

export function forecastCulturalCostBenefit(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalCostBenefitForecasterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalCostBenefitForecaster extends BaseManager {}

export const __culturalCostBenefitForecasterInternals = toolkit.internals;
