import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_regression_sentinel',
    collectionField: 'regressionChecks',
    idField: 'checkId',
    defaultName: 'Inclusion Regression Check',
    readyPosture: 'inclusion_regressions_guarded',
    defaultAgentId: 'agent:inclusion-regression',
    recommendationTypes: {
        primary: 'detect_inclusion_regressions',
        guard: 'mitigate_inclusion_regression_risk',
        audit: 'audit_inclusion_regression_signals',
        publish: 'publish_inclusion_regression_status'
    },
    recommendationTargetMap: {
        detect_inclusion_regressions: 'agent:inclusion',
        mitigate_inclusion_regression_risk: 'agent:reliability',
        audit_inclusion_regression_signals: 'agent:trust',
        publish_inclusion_regression_status: 'agent:ops'
    }
});

export function detectInclusionRegressions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionRegressionSentinelToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionRegressionSentinel extends BaseManager {}

export const __inclusionRegressionSentinelInternals = toolkit.internals;
