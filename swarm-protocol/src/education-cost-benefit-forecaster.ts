import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_cost_benefit_forecaster',
    collectionField: 'initiatives',
    idField: 'initiativeId',
    defaultName: 'Education Initiative',
    readyPosture: 'education_cost_benefit_forecast_ready',
    defaultAgentId: 'agent:education-cost-benefit',
    recommendationTypes: {
        primary: 'forecast_education_cost_benefit',
        guard: 'mitigate_education_negative_roi_risk',
        audit: 'audit_education_cost_benefit_signals',
        publish: 'publish_education_cost_benefit_status'
    },
    recommendationTargetMap: {
        forecast_education_cost_benefit: 'agent:finance',
        mitigate_education_negative_roi_risk: 'agent:planning',
        audit_education_cost_benefit_signals: 'agent:trust',
        publish_education_cost_benefit_status: 'agent:ops'
    }
});

export function forecastEducationCostBenefit(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationCostBenefitForecasterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationCostBenefitForecaster extends BaseManager {}

export const __educationCostBenefitForecasterInternals = toolkit.internals;
