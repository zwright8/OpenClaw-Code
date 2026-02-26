import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_regression_sentinel',
    collectionField: 'regressionChecks',
    idField: 'checkId',
    defaultName: 'Crisis Regression Check',
    readyPosture: 'crisis_regression_watch_ready',
    defaultAgentId: 'agent:crisis-regression',
    recommendationTypes: {
        primary: 'detect_crisis_regressions',
        guard: 'mitigate_crisis_release_regression',
        audit: 'audit_crisis_regression_signals',
        publish: 'publish_crisis_regression_status'
    },
    recommendationTargetMap: {
        detect_crisis_regressions: 'agent:crisis',
        mitigate_crisis_release_regression: 'agent:release',
        audit_crisis_regression_signals: 'agent:trust',
        publish_crisis_regression_status: 'agent:ops'
    }
});

export function detectCrisisRegressions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisRegressionSentinelToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisRegressionSentinel extends BaseManager {}

export const __crisisRegressionSentinelInternals = toolkit.internals;
