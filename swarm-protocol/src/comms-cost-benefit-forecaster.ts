import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_cost_benefit_forecaster',
    collectionField: 'initiatives',
    idField: 'initiativeId',
    defaultName: 'Comms Initiative',
    readyPosture: 'comms_cost_benefit_forecast_ready',
    defaultAgentId: 'agent:comms-cost-benefit',
    recommendationTypes: {
        primary: 'forecast_comms_cost_benefit',
        guard: 'mitigate_comms_negative_roi_risk',
        audit: 'audit_comms_cost_benefit_signals',
        publish: 'publish_comms_cost_benefit_status'
    },
    recommendationTargetMap: {
        forecast_comms_cost_benefit: 'agent:finance',
        mitigate_comms_negative_roi_risk: 'agent:planning',
        audit_comms_cost_benefit_signals: 'agent:trust',
        publish_comms_cost_benefit_status: 'agent:ops'
    }
});

export function forecastCommsCostBenefit(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsCostBenefitForecasterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsCostBenefitForecaster extends BaseManager {}

export const __commsCostBenefitForecasterInternals = toolkit.internals;
