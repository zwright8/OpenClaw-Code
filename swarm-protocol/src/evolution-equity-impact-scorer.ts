import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_equity_impact_scorer',
    collectionField: 'cohorts',
    idField: 'cohortId',
    defaultName: 'Evolution Cohort',
    readyPosture: 'evolution_equity_impact_scored',
    defaultAgentId: 'agent:evolution-equity-impact',
    recommendationTypes: {
        primary: 'score_evolution_equity_impact',
        guard: 'mitigate_evolution_inequitable_outcome_risk',
        audit: 'audit_evolution_equity_impact_signals',
        publish: 'publish_evolution_equity_impact_status'
    },
    recommendationTargetMap: {
        score_evolution_equity_impact: 'agent:evolution',
        mitigate_evolution_inequitable_outcome_risk: 'agent:policy',
        audit_evolution_equity_impact_signals: 'agent:trust',
        publish_evolution_equity_impact_status: 'agent:ops'
    }
});

export function scoreEvolutionEquityImpact(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionEquityImpactScorerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionEquityImpactScorer extends BaseManager {}

export const __evolutionEquityImpactScorerInternals = toolkit.internals;
