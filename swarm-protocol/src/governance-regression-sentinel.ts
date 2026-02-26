import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_regression_sentinel',
    collectionField: 'regressionChecks',
    idField: 'checkId',
    defaultName: 'Governance Regression Check',
    readyPosture: 'governance_regression_watch_ready',
    defaultAgentId: 'agent:governance-regression',
    recommendationTypes: {
        primary: 'detect_governance_regressions',
        guard: 'mitigate_governance_release_regression',
        audit: 'audit_governance_regression_signals',
        publish: 'publish_governance_regression_status'
    },
    recommendationTargetMap: {
        detect_governance_regressions: 'agent:governance',
        mitigate_governance_release_regression: 'agent:release',
        audit_governance_regression_signals: 'agent:trust',
        publish_governance_regression_status: 'agent:ops'
    }
});

export function detectGovernanceRegressions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceRegressionSentinelToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceRegressionSentinel extends BaseManager {}

export const __governanceRegressionSentinelInternals = toolkit.internals;
