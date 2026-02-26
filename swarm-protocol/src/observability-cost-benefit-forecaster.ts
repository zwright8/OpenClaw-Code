import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_cost_benefit_forecaster',
    collectionField: 'initiatives',
    idField: 'initiativeId',
    defaultName: 'Observability Initiative',
    readyPosture: 'observability_cost_benefit_forecast_ready',
    defaultAgentId: 'agent:observability-cost-benefit',
    recommendationTypes: {
        primary: 'forecast_observability_cost_benefit',
        guard: 'mitigate_observability_negative_roi_risk',
        audit: 'audit_observability_cost_benefit_signals',
        publish: 'publish_observability_cost_benefit_status'
    },
    recommendationTargetMap: {
        forecast_observability_cost_benefit: 'agent:finance',
        mitigate_observability_negative_roi_risk: 'agent:planning',
        audit_observability_cost_benefit_signals: 'agent:trust',
        publish_observability_cost_benefit_status: 'agent:ops'
    }
});

export function forecastObservabilityCostBenefit(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityCostBenefitForecasterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityCostBenefitForecaster extends BaseManager {}

export const __observabilityCostBenefitForecasterInternals = toolkit.internals;
