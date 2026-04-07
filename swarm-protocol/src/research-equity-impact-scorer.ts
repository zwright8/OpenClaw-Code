import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_equity_impact_scorer',
    collectionField: 'cohorts',
    idField: 'cohortId',
    defaultName: 'Research Cohort',
    readyPosture: 'research_equity_impact_scored',
    defaultAgentId: 'agent:research-equity-impact',
    recommendationTypes: {
        primary: 'score_research_equity_impact',
        guard: 'mitigate_research_uneven_outcome_risk',
        audit: 'audit_research_equity_impact_signals',
        publish: 'publish_research_equity_impact_status'
    },
    recommendationTargetMap: {
        score_research_equity_impact: 'agent:equity',
        mitigate_research_uneven_outcome_risk: 'agent:research',
        audit_research_equity_impact_signals: 'agent:trust',
        publish_research_equity_impact_status: 'agent:ops'
    }
});

export function scoreResearchEquityImpact(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchEquityImpactScorerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchEquityImpactScorer extends BaseManager {}

export const __researchEquityImpactScorerInternals = toolkit.internals;
