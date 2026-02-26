import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_regression_sentinel',
    collectionField: 'regressionChecks',
    idField: 'checkId',
    defaultName: 'Impact Regression Check',
    readyPosture: 'impact_regression_watch_ready',
    defaultAgentId: 'agent:impact-regression',
    recommendationTypes: {
        primary: 'detect_impact_regressions',
        guard: 'mitigate_impact_release_regression',
        audit: 'audit_impact_regression_signals',
        publish: 'publish_impact_regression_status'
    },
    recommendationTargetMap: {
        detect_impact_regressions: 'agent:impact',
        mitigate_impact_release_regression: 'agent:release',
        audit_impact_regression_signals: 'agent:trust',
        publish_impact_regression_status: 'agent:ops'
    }
});

export function detectImpactRegressions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactRegressionSentinelToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactRegressionSentinel extends BaseManager {}

export const __impactRegressionSentinelInternals = toolkit.internals;
