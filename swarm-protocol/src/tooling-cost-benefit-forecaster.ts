import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'tooling_cost_benefit_forecaster',
    collectionField: 'initiatives',
    idField: 'initiativeId',
    defaultName: 'Initiative',
    readyPosture: 'cost_benefit_forecast_ready',
    defaultAgentId: 'agent:tooling-cost-benefit',
    recommendationTypes: {
        primary: 'forecast_tooling_cost_benefit',
        guard: 'mitigate_negative_roi_risk',
        audit: 'audit_cost_benefit_signals',
        publish: 'publish_cost_benefit_status'
    },
    recommendationTargetMap: {
        forecast_tooling_cost_benefit: 'agent:finance',
        mitigate_negative_roi_risk: 'agent:planning',
        audit_cost_benefit_signals: 'agent:trust',
        publish_cost_benefit_status: 'agent:ops'
    }
});

export function forecastToolingCostBenefit(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function toolingCostBenefitForecasterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ToolingCostBenefitForecaster extends BaseManager {}

export const __toolingCostBenefitForecasterInternals = toolkit.internals;
