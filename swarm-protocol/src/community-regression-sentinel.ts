import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_regression_sentinel',
    collectionField: 'regressionChecks',
    idField: 'checkId',
    defaultName: 'Community Regression Check',
    readyPosture: 'community_regressions_guarded',
    defaultAgentId: 'agent:community-regression',
    recommendationTypes: {
        primary: 'detect_community_regressions',
        guard: 'mitigate_community_regression_risk',
        audit: 'audit_community_regression_signals',
        publish: 'publish_community_regression_status'
    },
    recommendationTargetMap: {
        detect_community_regressions: 'agent:community',
        mitigate_community_regression_risk: 'agent:reliability',
        audit_community_regression_signals: 'agent:trust',
        publish_community_regression_status: 'agent:ops'
    }
});

export function detectCommunityRegressions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityRegressionSentinelToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityRegressionSentinel extends BaseManager {}

export const __communityRegressionSentinelInternals = toolkit.internals;
