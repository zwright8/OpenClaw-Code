import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_cost_benefit_forecaster',
    collectionField: 'initiatives',
    idField: 'initiativeId',
    defaultName: 'Governance Initiative',
    readyPosture: 'governance_cost_benefit_forecast_ready',
    defaultAgentId: 'agent:governance-cost-benefit',
    recommendationTypes: {
        primary: 'forecast_governance_cost_benefit',
        guard: 'mitigate_governance_negative_roi_risk',
        audit: 'audit_governance_cost_benefit_signals',
        publish: 'publish_governance_cost_benefit_status'
    },
    recommendationTargetMap: {
        forecast_governance_cost_benefit: 'agent:finance',
        mitigate_governance_negative_roi_risk: 'agent:planning',
        audit_governance_cost_benefit_signals: 'agent:trust',
        publish_governance_cost_benefit_status: 'agent:ops'
    }
});

export function forecastGovernanceCostBenefit(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceCostBenefitForecasterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceCostBenefitForecaster extends BaseManager {}

export const __governanceCostBenefitForecasterInternals = toolkit.internals;
