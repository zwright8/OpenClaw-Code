import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_regression_sentinel',
    collectionField: 'regressionChecks',
    idField: 'checkId',
    defaultName: 'Economic Regression Check',
    readyPosture: 'economic_regression_watch_ready',
    defaultAgentId: 'agent:economic-regression',
    recommendationTypes: {
        primary: 'detect_economic_regressions',
        guard: 'mitigate_economic_release_regression',
        audit: 'audit_economic_regression_signals',
        publish: 'publish_economic_regression_status'
    },
    recommendationTargetMap: {
        detect_economic_regressions: 'agent:economic',
        mitigate_economic_release_regression: 'agent:release',
        audit_economic_regression_signals: 'agent:trust',
        publish_economic_regression_status: 'agent:ops'
    }
});

export function detectEconomicRegressions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicRegressionSentinelToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicRegressionSentinel extends BaseManager {}

export const __economicRegressionSentinelInternals = toolkit.internals;
