import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_equity_impact_scorer',
    collectionField: 'cohorts',
    idField: 'cohortId',
    defaultName: 'Infra Cohort',
    readyPosture: 'infra_equity_impact_scored',
    defaultAgentId: 'agent:infra-equity-impact',
    recommendationTypes: {
        primary: 'score_infra_equity_impact',
        guard: 'mitigate_infra_inequitable_outcome_risk',
        audit: 'audit_infra_equity_impact_signals',
        publish: 'publish_infra_equity_impact_status'
    },
    recommendationTargetMap: {
        score_infra_equity_impact: 'agent:infra',
        mitigate_infra_inequitable_outcome_risk: 'agent:policy',
        audit_infra_equity_impact_signals: 'agent:trust',
        publish_infra_equity_impact_status: 'agent:ops'
    }
});

export function scoreInfraEquityImpact(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraEquityImpactScorerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraEquityImpactScorer extends BaseManager {}

export const __infraEquityImpactScorerInternals = toolkit.internals;
