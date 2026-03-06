import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_regression_sentinel',
    collectionField: 'regressionChecks',
    idField: 'checkId',
    defaultName: 'Security Regression Check',
    readyPosture: 'security_regression_watch_ready',
    defaultAgentId: 'agent:security-regression',
    recommendationTypes: {
        primary: 'detect_security_regressions',
        guard: 'mitigate_security_release_regression',
        audit: 'audit_security_regression_signals',
        publish: 'publish_security_regression_status'
    },
    recommendationTargetMap: {
        detect_security_regressions: 'agent:security',
        mitigate_security_release_regression: 'agent:release',
        audit_security_regression_signals: 'agent:trust',
        publish_security_regression_status: 'agent:ops'
    }
});

export function detectSecurityRegressions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityRegressionSentinelToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityRegressionSentinel extends BaseManager {}

export const __securityRegressionSentinelInternals = toolkit.internals;
