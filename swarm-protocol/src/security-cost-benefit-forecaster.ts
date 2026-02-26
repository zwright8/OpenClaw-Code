import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_cost_benefit_forecaster',
    collectionField: 'initiatives',
    idField: 'initiativeId',
    defaultName: 'Security Initiative',
    readyPosture: 'security_cost_benefit_forecast_ready',
    defaultAgentId: 'agent:security-cost-benefit',
    recommendationTypes: {
        primary: 'forecast_security_cost_benefit',
        guard: 'mitigate_security_negative_roi_risk',
        audit: 'audit_security_cost_benefit_signals',
        publish: 'publish_security_cost_benefit_status'
    },
    recommendationTargetMap: {
        forecast_security_cost_benefit: 'agent:finance',
        mitigate_security_negative_roi_risk: 'agent:planning',
        audit_security_cost_benefit_signals: 'agent:trust',
        publish_security_cost_benefit_status: 'agent:ops'
    }
});

export function forecastSecurityCostBenefit(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityCostBenefitForecasterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityCostBenefitForecaster extends BaseManager {}

export const __securityCostBenefitForecasterInternals = toolkit.internals;
