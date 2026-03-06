import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'tooling_regression_sentinel',
    collectionField: 'regressionChecks',
    idField: 'checkId',
    defaultName: 'Regression Check',
    readyPosture: 'regression_watch_stable',
    defaultAgentId: 'agent:tooling-regression-sentinel',
    recommendationTypes: {
        primary: 'triage_tooling_regression_watchlist',
        guard: 'mitigate_release_regression_risk',
        audit: 'audit_regression_sentinel_signals',
        publish: 'publish_regression_sentinel_status'
    },
    recommendationTargetMap: {
        triage_tooling_regression_watchlist: 'agent:quality',
        mitigate_release_regression_risk: 'agent:release',
        audit_regression_sentinel_signals: 'agent:trust',
        publish_regression_sentinel_status: 'agent:ops'
    }
});

export function detectToolingRegression(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function toolingRegressionSentinelToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ToolingRegressionSentinel extends BaseManager {}

export const __toolingRegressionSentinelInternals = toolkit.internals;
