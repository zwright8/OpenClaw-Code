import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_cost_benefit_forecaster',
    collectionField: 'initiatives',
    idField: 'initiativeId',
    defaultName: 'Evolution Initiative',
    readyPosture: 'evolution_cost_benefit_forecast_ready',
    defaultAgentId: 'agent:evolution-cost-benefit',
    recommendationTypes: {
        primary: 'forecast_evolution_cost_benefit',
        guard: 'mitigate_evolution_negative_roi_risk',
        audit: 'audit_evolution_cost_benefit_signals',
        publish: 'publish_evolution_cost_benefit_status'
    },
    recommendationTargetMap: {
        forecast_evolution_cost_benefit: 'agent:evolution',
        mitigate_evolution_negative_roi_risk: 'agent:finance',
        audit_evolution_cost_benefit_signals: 'agent:trust',
        publish_evolution_cost_benefit_status: 'agent:ops'
    }
});

export function forecastEvolutionCostBenefit(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionCostBenefitForecasterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionCostBenefitForecaster extends BaseManager {}

export const __evolutionCostBenefitForecasterInternals = toolkit.internals;
