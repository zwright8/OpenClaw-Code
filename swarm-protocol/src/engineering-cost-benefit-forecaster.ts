import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_cost_benefit_forecaster',
    collectionField: 'initiatives',
    idField: 'initiativeId',
    defaultName: 'Engineering Initiative',
    readyPosture: 'engineering_cost_benefit_forecast_ready',
    defaultAgentId: 'agent:engineering-cost-benefit',
    recommendationTypes: {
        primary: 'forecast_engineering_cost_benefit',
        guard: 'mitigate_engineering_negative_roi_risk',
        audit: 'audit_engineering_cost_benefit_signals',
        publish: 'publish_engineering_cost_benefit_status'
    },
    recommendationTargetMap: {
        forecast_engineering_cost_benefit: 'agent:finance',
        mitigate_engineering_negative_roi_risk: 'agent:planning',
        audit_engineering_cost_benefit_signals: 'agent:trust',
        publish_engineering_cost_benefit_status: 'agent:ops'
    }
});

export function forecastEngineeringCostBenefit(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringCostBenefitForecasterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringCostBenefitForecaster extends BaseManager {}

export const __engineeringCostBenefitForecasterInternals = toolkit.internals;
