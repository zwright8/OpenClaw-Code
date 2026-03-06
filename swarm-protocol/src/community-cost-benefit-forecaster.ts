import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_cost_benefit_forecaster',
    collectionField: 'initiatives',
    idField: 'initiativeId',
    defaultName: 'Community Initiative',
    readyPosture: 'community_cost_benefit_forecast_ready',
    defaultAgentId: 'agent:community-cost-benefit',
    recommendationTypes: {
        primary: 'forecast_community_cost_benefit',
        guard: 'mitigate_community_negative_roi_risk',
        audit: 'audit_community_cost_benefit_signals',
        publish: 'publish_community_cost_benefit_status'
    },
    recommendationTargetMap: {
        forecast_community_cost_benefit: 'agent:finance',
        mitigate_community_negative_roi_risk: 'agent:planning',
        audit_community_cost_benefit_signals: 'agent:trust',
        publish_community_cost_benefit_status: 'agent:ops'
    }
});

export function forecastCommunityCostBenefit(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityCostBenefitForecasterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityCostBenefitForecaster extends BaseManager {}

export const __communityCostBenefitForecasterInternals = toolkit.internals;
