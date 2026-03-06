import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_cost_benefit_forecaster',
    collectionField: 'initiatives',
    idField: 'initiativeId',
    defaultName: 'Inclusion Initiative',
    readyPosture: 'inclusion_cost_benefit_forecast_ready',
    defaultAgentId: 'agent:inclusion-cost-benefit',
    recommendationTypes: {
        primary: 'forecast_inclusion_cost_benefit',
        guard: 'mitigate_inclusion_negative_roi_risk',
        audit: 'audit_inclusion_cost_benefit_signals',
        publish: 'publish_inclusion_cost_benefit_status'
    },
    recommendationTargetMap: {
        forecast_inclusion_cost_benefit: 'agent:finance',
        mitigate_inclusion_negative_roi_risk: 'agent:planning',
        audit_inclusion_cost_benefit_signals: 'agent:trust',
        publish_inclusion_cost_benefit_status: 'agent:ops'
    }
});

export function forecastInclusionCostBenefit(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionCostBenefitForecasterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionCostBenefitForecaster extends BaseManager {}

export const __inclusionCostBenefitForecasterInternals = toolkit.internals;
