import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_regression_sentinel',
    collectionField: 'regressionChecks',
    idField: 'checkId',
    defaultName: 'Rights Regression Check',
    readyPosture: 'rights_regressions_guarded',
    defaultAgentId: 'agent:rights-regression',
    recommendationTypes: {
        primary: 'detect_rights_regressions',
        guard: 'mitigate_rights_regression_risk',
        audit: 'audit_rights_regression_signals',
        publish: 'publish_rights_regression_status'
    },
    recommendationTargetMap: {
        detect_rights_regressions: 'agent:rights',
        mitigate_rights_regression_risk: 'agent:reliability',
        audit_rights_regression_signals: 'agent:trust',
        publish_rights_regression_status: 'agent:ops'
    }
});

export function detectRightsRegressions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsRegressionSentinelToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsRegressionSentinel extends BaseManager {}

export const __rightsRegressionSentinelInternals = toolkit.internals;
