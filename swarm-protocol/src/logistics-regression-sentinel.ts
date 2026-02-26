import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_regression_sentinel',
    collectionField: 'regressionChecks',
    idField: 'checkId',
    defaultName: 'Logistics Regression Check',
    readyPosture: 'logistics_regression_watch_ready',
    defaultAgentId: 'agent:logistics-regression',
    recommendationTypes: {
        primary: 'detect_logistics_regressions',
        guard: 'mitigate_logistics_release_regression',
        audit: 'audit_logistics_regression_signals',
        publish: 'publish_logistics_regression_status'
    },
    recommendationTargetMap: {
        detect_logistics_regressions: 'agent:logistics',
        mitigate_logistics_release_regression: 'agent:release',
        audit_logistics_regression_signals: 'agent:trust',
        publish_logistics_regression_status: 'agent:ops'
    }
});

export function detectLogisticsRegressions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsRegressionSentinelToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsRegressionSentinel extends BaseManager {}

export const __logisticsRegressionSentinelInternals = toolkit.internals;
