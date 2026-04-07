import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_equity_impact_scorer',
    collectionField: 'cohorts',
    idField: 'cohortId',
    defaultName: 'Cultural Cohort',
    readyPosture: 'cultural_equity_impact_scored',
    defaultAgentId: 'agent:cultural-equity-impact',
    recommendationTypes: {
        primary: 'score_cultural_equity_impact',
        guard: 'mitigate_cultural_uneven_outcome_risk',
        audit: 'audit_cultural_equity_impact_signals',
        publish: 'publish_cultural_equity_impact_status'
    },
    recommendationTargetMap: {
        score_cultural_equity_impact: 'agent:equity',
        mitigate_cultural_uneven_outcome_risk: 'agent:cultural',
        audit_cultural_equity_impact_signals: 'agent:trust',
        publish_cultural_equity_impact_status: 'agent:ops'
    }
});

export function scoreCulturalEquityImpact(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalEquityImpactScorerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalEquityImpactScorer extends BaseManager {}

export const __culturalEquityImpactScorerInternals = toolkit.internals;
