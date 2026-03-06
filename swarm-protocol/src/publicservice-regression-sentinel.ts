import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_regression_sentinel',
    collectionField: 'regressionChecks',
    idField: 'checkId',
    defaultName: 'PublicService Regression Check',
    readyPosture: 'publicservice_regression_watch_ready',
    defaultAgentId: 'agent:publicservice-regression',
    recommendationTypes: {
        primary: 'detect_publicservice_regressions',
        guard: 'mitigate_publicservice_release_regression',
        audit: 'audit_publicservice_regression_signals',
        publish: 'publish_publicservice_regression_status'
    },
    recommendationTargetMap: {
        detect_publicservice_regressions: 'agent:publicservice',
        mitigate_publicservice_release_regression: 'agent:release',
        audit_publicservice_regression_signals: 'agent:trust',
        publish_publicservice_regression_status: 'agent:ops'
    }
});

export function detectPublicServiceRegressions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceRegressionSentinelToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceRegressionSentinel extends BaseManager {}

export const __publicServiceRegressionSentinelInternals = toolkit.internals;
