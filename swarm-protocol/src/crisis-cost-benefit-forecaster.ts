import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_cost_benefit_forecaster',
    collectionField: 'initiatives',
    idField: 'initiativeId',
    defaultName: 'Crisis Initiative',
    readyPosture: 'crisis_cost_benefit_forecast_ready',
    defaultAgentId: 'agent:crisis-cost-benefit',
    recommendationTypes: {
        primary: 'forecast_crisis_cost_benefit',
        guard: 'mitigate_crisis_negative_roi_risk',
        audit: 'audit_crisis_cost_benefit_signals',
        publish: 'publish_crisis_cost_benefit_status'
    },
    recommendationTargetMap: {
        forecast_crisis_cost_benefit: 'agent:finance',
        mitigate_crisis_negative_roi_risk: 'agent:planning',
        audit_crisis_cost_benefit_signals: 'agent:trust',
        publish_crisis_cost_benefit_status: 'agent:ops'
    }
});

export function forecastCrisisCostBenefit(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisCostBenefitForecasterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisCostBenefitForecaster extends BaseManager {}

export const __crisisCostBenefitForecasterInternals = toolkit.internals;
