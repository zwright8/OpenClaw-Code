import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_regression_sentinel',
    collectionField: 'regressionChecks',
    idField: 'checkId',
    defaultName: 'Engineering Regression Check',
    readyPosture: 'engineering_regression_watch_ready',
    defaultAgentId: 'agent:engineering-regression',
    recommendationTypes: {
        primary: 'detect_engineering_regressions',
        guard: 'mitigate_engineering_release_regression',
        audit: 'audit_engineering_regression_signals',
        publish: 'publish_engineering_regression_status'
    },
    recommendationTargetMap: {
        detect_engineering_regressions: 'agent:engineering',
        mitigate_engineering_release_regression: 'agent:release',
        audit_engineering_regression_signals: 'agent:trust',
        publish_engineering_regression_status: 'agent:ops'
    }
});

export function detectEngineeringRegressions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringRegressionSentinelToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringRegressionSentinel extends BaseManager {}

export const __engineeringRegressionSentinelInternals = toolkit.internals;
