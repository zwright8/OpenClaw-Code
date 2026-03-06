import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_equity_impact_scorer',
    collectionField: 'cohorts',
    idField: 'cohortId',
    defaultName: 'Crisis Cohort',
    readyPosture: 'crisis_equity_impact_scored',
    defaultAgentId: 'agent:crisis-equity-impact',
    recommendationTypes: {
        primary: 'score_crisis_equity_impact',
        guard: 'mitigate_crisis_uneven_outcome_risk',
        audit: 'audit_crisis_equity_impact_signals',
        publish: 'publish_crisis_equity_impact_status'
    },
    recommendationTargetMap: {
        score_crisis_equity_impact: 'agent:equity',
        mitigate_crisis_uneven_outcome_risk: 'agent:crisis',
        audit_crisis_equity_impact_signals: 'agent:trust',
        publish_crisis_equity_impact_status: 'agent:ops'
    }
});

export function scoreCrisisEquityImpact(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisEquityImpactScorerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisEquityImpactScorer extends BaseManager {}

export const __crisisEquityImpactScorerInternals = toolkit.internals;
