import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_equity_impact_scorer',
    collectionField: 'cohorts',
    idField: 'cohortId',
    defaultName: 'Federation Cohort',
    readyPosture: 'federation_equity_impact_scored',
    defaultAgentId: 'agent:federation-equity-impact',
    recommendationTypes: {
        primary: 'score_federation_equity_impact',
        guard: 'mitigate_federation_uneven_outcome_risk',
        audit: 'audit_federation_equity_impact_signals',
        publish: 'publish_federation_equity_impact_status'
    },
    recommendationTargetMap: {
        score_federation_equity_impact: 'agent:equity',
        mitigate_federation_uneven_outcome_risk: 'agent:federation',
        audit_federation_equity_impact_signals: 'agent:trust',
        publish_federation_equity_impact_status: 'agent:ops'
    }
});

export function scoreFederationEquityImpact(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationEquityImpactScorerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationEquityImpactScorer extends BaseManager {}

export const __federationEquityImpactScorerInternals = toolkit.internals;
