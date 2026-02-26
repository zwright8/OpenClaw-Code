import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_equity_impact_scorer',
    collectionField: 'cohorts',
    idField: 'cohortId',
    defaultName: 'Economic Cohort',
    readyPosture: 'economic_equity_impact_scored',
    defaultAgentId: 'agent:economic-equity-impact',
    recommendationTypes: {
        primary: 'score_economic_equity_impact',
        guard: 'mitigate_economic_uneven_outcome_risk',
        audit: 'audit_economic_equity_impact_signals',
        publish: 'publish_economic_equity_impact_status'
    },
    recommendationTargetMap: {
        score_economic_equity_impact: 'agent:equity',
        mitigate_economic_uneven_outcome_risk: 'agent:economic',
        audit_economic_equity_impact_signals: 'agent:trust',
        publish_economic_equity_impact_status: 'agent:ops'
    }
});

export function scoreEconomicEquityImpact(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicEquityImpactScorerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicEquityImpactScorer extends BaseManager {}

export const __economicEquityImpactScorerInternals = toolkit.internals;
