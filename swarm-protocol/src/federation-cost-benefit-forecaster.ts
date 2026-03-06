import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_cost_benefit_forecaster',
    collectionField: 'initiatives',
    idField: 'initiativeId',
    defaultName: 'Federation Initiative',
    readyPosture: 'federation_cost_benefit_forecast_ready',
    defaultAgentId: 'agent:federation-cost-benefit',
    recommendationTypes: {
        primary: 'forecast_federation_cost_benefit',
        guard: 'mitigate_federation_negative_roi_risk',
        audit: 'audit_federation_cost_benefit_signals',
        publish: 'publish_federation_cost_benefit_status'
    },
    recommendationTargetMap: {
        forecast_federation_cost_benefit: 'agent:finance',
        mitigate_federation_negative_roi_risk: 'agent:planning',
        audit_federation_cost_benefit_signals: 'agent:trust',
        publish_federation_cost_benefit_status: 'agent:ops'
    }
});

export function forecastFederationCostBenefit(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationCostBenefitForecasterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationCostBenefitForecaster extends BaseManager {}

export const __federationCostBenefitForecasterInternals = toolkit.internals;
