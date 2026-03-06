import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_cost_benefit_forecaster',
    collectionField: 'initiatives',
    idField: 'initiativeId',
    defaultName: 'Infra Initiative',
    readyPosture: 'infra_cost_benefit_forecast_ready',
    defaultAgentId: 'agent:infra-cost-benefit',
    recommendationTypes: {
        primary: 'forecast_infra_cost_benefit',
        guard: 'mitigate_infra_negative_roi_risk',
        audit: 'audit_infra_cost_benefit_signals',
        publish: 'publish_infra_cost_benefit_status'
    },
    recommendationTargetMap: {
        forecast_infra_cost_benefit: 'agent:infra',
        mitigate_infra_negative_roi_risk: 'agent:finance',
        audit_infra_cost_benefit_signals: 'agent:trust',
        publish_infra_cost_benefit_status: 'agent:ops'
    }
});

export function forecastInfraCostBenefit(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraCostBenefitForecasterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraCostBenefitForecaster extends BaseManager {}

export const __infraCostBenefitForecasterInternals = toolkit.internals;
