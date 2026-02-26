import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_regression_sentinel',
    collectionField: 'regressionChecks',
    idField: 'checkId',
    defaultName: 'Cultural Regression Check',
    readyPosture: 'cultural_regressions_guarded',
    defaultAgentId: 'agent:cultural-regression',
    recommendationTypes: {
        primary: 'detect_cultural_regressions',
        guard: 'mitigate_cultural_regression_risk',
        audit: 'audit_cultural_regression_signals',
        publish: 'publish_cultural_regression_status'
    },
    recommendationTargetMap: {
        detect_cultural_regressions: 'agent:cultural',
        mitigate_cultural_regression_risk: 'agent:reliability',
        audit_cultural_regression_signals: 'agent:trust',
        publish_cultural_regression_status: 'agent:ops'
    }
});

export function detectCulturalRegressions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalRegressionSentinelToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalRegressionSentinel extends BaseManager {}

export const __culturalRegressionSentinelInternals = toolkit.internals;
