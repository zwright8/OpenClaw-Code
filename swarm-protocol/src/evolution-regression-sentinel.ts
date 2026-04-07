import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_regression_sentinel',
    collectionField: 'regressionChecks',
    idField: 'checkId',
    defaultName: 'Evolution Regression Check',
    readyPosture: 'evolution_regressions_guarded',
    defaultAgentId: 'agent:evolution-regression',
    recommendationTypes: {
        primary: 'detect_evolution_regressions',
        guard: 'mitigate_evolution_regression_risk',
        audit: 'audit_evolution_regression_signals',
        publish: 'publish_evolution_regression_status'
    },
    recommendationTargetMap: {
        detect_evolution_regressions: 'agent:evolution',
        mitigate_evolution_regression_risk: 'agent:reliability',
        audit_evolution_regression_signals: 'agent:trust',
        publish_evolution_regression_status: 'agent:ops'
    }
});

export function detectEvolutionRegressions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionRegressionSentinelToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionRegressionSentinel extends BaseManager {}

export const __evolutionRegressionSentinelInternals = toolkit.internals;
