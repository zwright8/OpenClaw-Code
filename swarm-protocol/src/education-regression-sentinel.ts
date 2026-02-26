import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_regression_sentinel',
    collectionField: 'regressionChecks',
    idField: 'checkId',
    defaultName: 'Education Regression Check',
    readyPosture: 'education_regression_watch_ready',
    defaultAgentId: 'agent:education-regression',
    recommendationTypes: {
        primary: 'detect_education_regressions',
        guard: 'mitigate_education_release_regression',
        audit: 'audit_education_regression_signals',
        publish: 'publish_education_regression_status'
    },
    recommendationTargetMap: {
        detect_education_regressions: 'agent:education',
        mitigate_education_release_regression: 'agent:release',
        audit_education_regression_signals: 'agent:trust',
        publish_education_regression_status: 'agent:ops'
    }
});

export function detectEducationRegressions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationRegressionSentinelToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationRegressionSentinel extends BaseManager {}

export const __educationRegressionSentinelInternals = toolkit.internals;
