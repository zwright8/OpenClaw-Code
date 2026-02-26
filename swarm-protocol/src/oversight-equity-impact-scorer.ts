import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_equity_impact_scorer',
    collectionField: 'cohorts',
    idField: 'cohortId',
    defaultName: 'Oversight Cohort',
    readyPosture: 'oversight_equity_impact_scored',
    defaultAgentId: 'agent:oversight-equity-impact',
    recommendationTypes: {
        primary: 'score_oversight_equity_impact',
        guard: 'mitigate_oversight_uneven_outcome_risk',
        audit: 'audit_oversight_equity_impact_signals',
        publish: 'publish_oversight_equity_impact_status'
    },
    recommendationTargetMap: {
        score_oversight_equity_impact: 'agent:equity',
        mitigate_oversight_uneven_outcome_risk: 'agent:oversight',
        audit_oversight_equity_impact_signals: 'agent:trust',
        publish_oversight_equity_impact_status: 'agent:ops'
    }
});

export function scoreOversightEquityImpact(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightEquityImpactScorerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightEquityImpactScorer extends BaseManager {}

export const __oversightEquityImpactScorerInternals = toolkit.internals;
