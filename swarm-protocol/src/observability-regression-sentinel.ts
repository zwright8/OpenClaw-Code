import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_regression_sentinel',
    collectionField: 'regressionChecks',
    idField: 'checkId',
    defaultName: 'Observability Regression Check',
    readyPosture: 'observability_regression_watch_ready',
    defaultAgentId: 'agent:observability-regression',
    recommendationTypes: {
        primary: 'detect_observability_regressions',
        guard: 'mitigate_observability_release_regression',
        audit: 'audit_observability_regression_signals',
        publish: 'publish_observability_regression_status'
    },
    recommendationTargetMap: {
        detect_observability_regressions: 'agent:observability',
        mitigate_observability_release_regression: 'agent:release',
        audit_observability_regression_signals: 'agent:trust',
        publish_observability_regression_status: 'agent:ops'
    }
});

export function detectObservabilityRegressions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityRegressionSentinelToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityRegressionSentinel extends BaseManager {}

export const __observabilityRegressionSentinelInternals = toolkit.internals;
