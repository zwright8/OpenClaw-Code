import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_cost_benefit_forecaster',
    collectionField: 'initiatives',
    idField: 'initiativeId',
    defaultName: 'Logistics Initiative',
    readyPosture: 'logistics_cost_benefit_forecast_ready',
    defaultAgentId: 'agent:logistics-cost-benefit',
    recommendationTypes: {
        primary: 'forecast_logistics_cost_benefit',
        guard: 'mitigate_logistics_negative_roi_risk',
        audit: 'audit_logistics_cost_benefit_signals',
        publish: 'publish_logistics_cost_benefit_status'
    },
    recommendationTargetMap: {
        forecast_logistics_cost_benefit: 'agent:finance',
        mitigate_logistics_negative_roi_risk: 'agent:planning',
        audit_logistics_cost_benefit_signals: 'agent:trust',
        publish_logistics_cost_benefit_status: 'agent:ops'
    }
});

export function forecastLogisticsCostBenefit(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsCostBenefitForecasterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsCostBenefitForecaster extends BaseManager {}

export const __logisticsCostBenefitForecasterInternals = toolkit.internals;
