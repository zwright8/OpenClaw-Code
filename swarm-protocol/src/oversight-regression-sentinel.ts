import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_regression_sentinel',
    collectionField: 'regressionChecks',
    idField: 'checkId',
    defaultName: 'Oversight Regression Check',
    readyPosture: 'oversight_regression_watch_ready',
    defaultAgentId: 'agent:oversight-regression',
    recommendationTypes: {
        primary: 'detect_oversight_regressions',
        guard: 'mitigate_oversight_release_regression',
        audit: 'audit_oversight_regression_signals',
        publish: 'publish_oversight_regression_status'
    },
    recommendationTargetMap: {
        detect_oversight_regressions: 'agent:oversight',
        mitigate_oversight_release_regression: 'agent:release',
        audit_oversight_regression_signals: 'agent:trust',
        publish_oversight_regression_status: 'agent:ops'
    }
});

export function detectOversightRegressions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightRegressionSentinelToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightRegressionSentinel extends BaseManager {}

export const __oversightRegressionSentinelInternals = toolkit.internals;
