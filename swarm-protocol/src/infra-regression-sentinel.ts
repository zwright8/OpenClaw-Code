import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_regression_sentinel',
    collectionField: 'regressionChecks',
    idField: 'checkId',
    defaultName: 'Infra Regression Check',
    readyPosture: 'infra_regressions_guarded',
    defaultAgentId: 'agent:infra-regression',
    recommendationTypes: {
        primary: 'detect_infra_regressions',
        guard: 'mitigate_infra_regression_risk',
        audit: 'audit_infra_regression_signals',
        publish: 'publish_infra_regression_status'
    },
    recommendationTargetMap: {
        detect_infra_regressions: 'agent:infra',
        mitigate_infra_regression_risk: 'agent:reliability',
        audit_infra_regression_signals: 'agent:trust',
        publish_infra_regression_status: 'agent:ops'
    }
});

export function detectInfraRegressions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraRegressionSentinelToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraRegressionSentinel extends BaseManager {}

export const __infraRegressionSentinelInternals = toolkit.internals;
