import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_regression_sentinel',
    collectionField: 'regressionChecks',
    idField: 'checkId',
    defaultName: 'Collab Regression Check',
    readyPosture: 'collab_regression_watch_ready',
    defaultAgentId: 'agent:collab-regression',
    recommendationTypes: {
        primary: 'detect_collab_regressions',
        guard: 'mitigate_collab_release_regression',
        audit: 'audit_collab_regression_signals',
        publish: 'publish_collab_regression_status'
    },
    recommendationTargetMap: {
        detect_collab_regressions: 'agent:collab',
        mitigate_collab_release_regression: 'agent:release',
        audit_collab_regression_signals: 'agent:trust',
        publish_collab_regression_status: 'agent:ops'
    }
});

export function detectCollabRegressions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabRegressionSentinelToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabRegressionSentinel extends BaseManager {}

export const __collabRegressionSentinelInternals = toolkit.internals;
