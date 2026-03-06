import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_cost_benefit_forecaster',
    collectionField: 'initiatives',
    idField: 'initiativeId',
    defaultName: 'Rights Initiative',
    readyPosture: 'rights_cost_benefit_forecast_ready',
    defaultAgentId: 'agent:rights-cost-benefit',
    recommendationTypes: {
        primary: 'forecast_rights_cost_benefit',
        guard: 'mitigate_rights_negative_roi_risk',
        audit: 'audit_rights_cost_benefit_signals',
        publish: 'publish_rights_cost_benefit_status'
    },
    recommendationTargetMap: {
        forecast_rights_cost_benefit: 'agent:rights',
        mitigate_rights_negative_roi_risk: 'agent:finance',
        audit_rights_cost_benefit_signals: 'agent:trust',
        publish_rights_cost_benefit_status: 'agent:ops'
    }
});

export function forecastRightsCostBenefit(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsCostBenefitForecasterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsCostBenefitForecaster extends BaseManager {}

export const __rightsCostBenefitForecasterInternals = toolkit.internals;
