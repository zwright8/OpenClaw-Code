import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_regression_sentinel',
    collectionField: 'regressionChecks',
    idField: 'checkId',
    defaultName: 'Federation Regression Check',
    readyPosture: 'federation_regression_watch_ready',
    defaultAgentId: 'agent:federation-regression',
    recommendationTypes: {
        primary: 'detect_federation_regressions',
        guard: 'mitigate_federation_release_regression',
        audit: 'audit_federation_regression_signals',
        publish: 'publish_federation_regression_status'
    },
    recommendationTargetMap: {
        detect_federation_regressions: 'agent:federation',
        mitigate_federation_release_regression: 'agent:release',
        audit_federation_regression_signals: 'agent:trust',
        publish_federation_regression_status: 'agent:ops'
    }
});

export function detectFederationRegressions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationRegressionSentinelToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationRegressionSentinel extends BaseManager {}

export const __federationRegressionSentinelInternals = toolkit.internals;
