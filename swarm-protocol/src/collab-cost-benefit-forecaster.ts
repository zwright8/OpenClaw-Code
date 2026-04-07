import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_cost_benefit_forecaster',
    collectionField: 'initiatives',
    idField: 'initiativeId',
    defaultName: 'Collab Initiative',
    readyPosture: 'collab_cost_benefit_forecast_ready',
    defaultAgentId: 'agent:collab-cost-benefit',
    recommendationTypes: {
        primary: 'forecast_collab_cost_benefit',
        guard: 'mitigate_collab_negative_roi_risk',
        audit: 'audit_collab_cost_benefit_signals',
        publish: 'publish_collab_cost_benefit_status'
    },
    recommendationTargetMap: {
        forecast_collab_cost_benefit: 'agent:finance',
        mitigate_collab_negative_roi_risk: 'agent:planning',
        audit_collab_cost_benefit_signals: 'agent:trust',
        publish_collab_cost_benefit_status: 'agent:ops'
    }
});

export function forecastCollabCostBenefit(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabCostBenefitForecasterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabCostBenefitForecaster extends BaseManager {}

export const __collabCostBenefitForecasterInternals = toolkit.internals;
