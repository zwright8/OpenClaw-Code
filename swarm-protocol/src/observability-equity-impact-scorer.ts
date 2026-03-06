import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_equity_impact_scorer',
    collectionField: 'cohorts',
    idField: 'cohortId',
    defaultName: 'Observability Cohort',
    readyPosture: 'observability_equity_impact_scored',
    defaultAgentId: 'agent:observability-equity-impact',
    recommendationTypes: {
        primary: 'score_observability_equity_impact',
        guard: 'mitigate_observability_uneven_outcome_risk',
        audit: 'audit_observability_equity_impact_signals',
        publish: 'publish_observability_equity_impact_status'
    },
    recommendationTargetMap: {
        score_observability_equity_impact: 'agent:equity',
        mitigate_observability_uneven_outcome_risk: 'agent:observability',
        audit_observability_equity_impact_signals: 'agent:trust',
        publish_observability_equity_impact_status: 'agent:ops'
    }
});

export function scoreObservabilityEquityImpact(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityEquityImpactScorerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityEquityImpactScorer extends BaseManager {}

export const __observabilityEquityImpactScorerInternals = toolkit.internals;
