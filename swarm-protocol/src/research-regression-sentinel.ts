import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_regression_sentinel',
    collectionField: 'regressionChecks',
    idField: 'checkId',
    defaultName: 'Research Regression Check',
    readyPosture: 'research_regression_watch_ready',
    defaultAgentId: 'agent:research-regression',
    recommendationTypes: {
        primary: 'detect_research_regressions',
        guard: 'mitigate_research_release_regression',
        audit: 'audit_research_regression_signals',
        publish: 'publish_research_regression_status'
    },
    recommendationTargetMap: {
        detect_research_regressions: 'agent:research',
        mitigate_research_release_regression: 'agent:release',
        audit_research_regression_signals: 'agent:trust',
        publish_research_regression_status: 'agent:ops'
    }
});

export function detectResearchRegressions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchRegressionSentinelToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchRegressionSentinel extends BaseManager {}

export const __researchRegressionSentinelInternals = toolkit.internals;
