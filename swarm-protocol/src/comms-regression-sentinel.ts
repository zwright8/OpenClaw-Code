import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_regression_sentinel',
    collectionField: 'regressionChecks',
    idField: 'checkId',
    defaultName: 'Comms Regression Check',
    readyPosture: 'comms_regression_watch_ready',
    defaultAgentId: 'agent:comms-regression',
    recommendationTypes: {
        primary: 'detect_comms_regressions',
        guard: 'mitigate_comms_release_regression',
        audit: 'audit_comms_regression_signals',
        publish: 'publish_comms_regression_status'
    },
    recommendationTargetMap: {
        detect_comms_regressions: 'agent:comms',
        mitigate_comms_release_regression: 'agent:release',
        audit_comms_regression_signals: 'agent:trust',
        publish_comms_regression_status: 'agent:ops'
    }
});

export function detectCommsRegressions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsRegressionSentinelToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsRegressionSentinel extends BaseManager {}

export const __commsRegressionSentinelInternals = toolkit.internals;
