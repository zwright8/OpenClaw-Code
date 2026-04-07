import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_cost_benefit_forecaster',
    collectionField: 'initiatives',
    idField: 'initiativeId',
    defaultName: 'PublicService Initiative',
    readyPosture: 'publicservice_cost_benefit_forecast_ready',
    defaultAgentId: 'agent:publicservice-cost-benefit',
    recommendationTypes: {
        primary: 'forecast_publicservice_cost_benefit',
        guard: 'mitigate_publicservice_negative_roi_risk',
        audit: 'audit_publicservice_cost_benefit_signals',
        publish: 'publish_publicservice_cost_benefit_status'
    },
    recommendationTargetMap: {
        forecast_publicservice_cost_benefit: 'agent:finance',
        mitigate_publicservice_negative_roi_risk: 'agent:planning',
        audit_publicservice_cost_benefit_signals: 'agent:trust',
        publish_publicservice_cost_benefit_status: 'agent:ops'
    }
});

export function forecastPublicServiceCostBenefit(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceCostBenefitForecasterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceCostBenefitForecaster extends BaseManager {}

export const __publicServiceCostBenefitForecasterInternals = toolkit.internals;
