import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_equity_impact_scorer',
    collectionField: 'cohorts',
    idField: 'cohortId',
    defaultName: 'Impact Cohort',
    readyPosture: 'impact_equity_impact_scored',
    defaultAgentId: 'agent:impact-equity-impact',
    recommendationTypes: {
        primary: 'score_impact_equity_impact',
        guard: 'mitigate_impact_uneven_outcome_risk',
        audit: 'audit_impact_equity_impact_signals',
        publish: 'publish_impact_equity_impact_status'
    },
    recommendationTargetMap: {
        score_impact_equity_impact: 'agent:equity',
        mitigate_impact_uneven_outcome_risk: 'agent:impact',
        audit_impact_equity_impact_signals: 'agent:trust',
        publish_impact_equity_impact_status: 'agent:ops'
    }
});

export function scoreImpactEquityImpact(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactEquityImpactScorerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactEquityImpactScorer extends BaseManager {}

export const __impactEquityImpactScorerInternals = toolkit.internals;
