import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_cost_benefit_forecaster',
    collectionField: 'initiatives',
    idField: 'initiativeId',
    defaultName: 'Oversight Initiative',
    readyPosture: 'oversight_cost_benefit_forecast_ready',
    defaultAgentId: 'agent:oversight-cost-benefit',
    recommendationTypes: {
        primary: 'forecast_oversight_cost_benefit',
        guard: 'mitigate_oversight_negative_roi_risk',
        audit: 'audit_oversight_cost_benefit_signals',
        publish: 'publish_oversight_cost_benefit_status'
    },
    recommendationTargetMap: {
        forecast_oversight_cost_benefit: 'agent:finance',
        mitigate_oversight_negative_roi_risk: 'agent:planning',
        audit_oversight_cost_benefit_signals: 'agent:trust',
        publish_oversight_cost_benefit_status: 'agent:ops'
    }
});

export function forecastOversightCostBenefit(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightCostBenefitForecasterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightCostBenefitForecaster extends BaseManager {}

export const __oversightCostBenefitForecasterInternals = toolkit.internals;
