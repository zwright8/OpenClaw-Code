import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_equity_impact_scorer',
    collectionField: 'cohorts',
    idField: 'cohortId',
    defaultName: 'Logistics Cohort',
    readyPosture: 'logistics_equity_impact_scored',
    defaultAgentId: 'agent:logistics-equity-impact',
    recommendationTypes: {
        primary: 'score_logistics_equity_impact',
        guard: 'mitigate_logistics_uneven_outcome_risk',
        audit: 'audit_logistics_equity_impact_signals',
        publish: 'publish_logistics_equity_impact_status'
    },
    recommendationTargetMap: {
        score_logistics_equity_impact: 'agent:equity',
        mitigate_logistics_uneven_outcome_risk: 'agent:logistics',
        audit_logistics_equity_impact_signals: 'agent:trust',
        publish_logistics_equity_impact_status: 'agent:ops'
    }
});

export function scoreLogisticsEquityImpact(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsEquityImpactScorerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsEquityImpactScorer extends BaseManager {}

export const __logisticsEquityImpactScorerInternals = toolkit.internals;
