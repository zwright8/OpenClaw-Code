import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_equity_impact_scorer',
    collectionField: 'cohorts',
    idField: 'cohortId',
    defaultName: 'Inclusion Cohort',
    readyPosture: 'inclusion_equity_impact_scored',
    defaultAgentId: 'agent:inclusion-equity-impact',
    recommendationTypes: {
        primary: 'score_inclusion_equity_impact',
        guard: 'mitigate_inclusion_uneven_outcome_risk',
        audit: 'audit_inclusion_equity_impact_signals',
        publish: 'publish_inclusion_equity_impact_status'
    },
    recommendationTargetMap: {
        score_inclusion_equity_impact: 'agent:equity',
        mitigate_inclusion_uneven_outcome_risk: 'agent:inclusion',
        audit_inclusion_equity_impact_signals: 'agent:trust',
        publish_inclusion_equity_impact_status: 'agent:ops'
    }
});

export function scoreInclusionEquityImpact(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionEquityImpactScorerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionEquityImpactScorer extends BaseManager {}

export const __inclusionEquityImpactScorerInternals = toolkit.internals;
