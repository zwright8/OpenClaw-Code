import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_equity_impact_scorer',
    collectionField: 'cohorts',
    idField: 'cohortId',
    defaultName: 'PublicService Cohort',
    readyPosture: 'publicservice_equity_impact_scored',
    defaultAgentId: 'agent:publicservice-equity-impact',
    recommendationTypes: {
        primary: 'score_publicservice_equity_impact',
        guard: 'mitigate_publicservice_uneven_outcome_risk',
        audit: 'audit_publicservice_equity_impact_signals',
        publish: 'publish_publicservice_equity_impact_status'
    },
    recommendationTargetMap: {
        score_publicservice_equity_impact: 'agent:equity',
        mitigate_publicservice_uneven_outcome_risk: 'agent:publicservice',
        audit_publicservice_equity_impact_signals: 'agent:trust',
        publish_publicservice_equity_impact_status: 'agent:ops'
    }
});

export function scorePublicServiceEquityImpact(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceEquityImpactScorerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceEquityImpactScorer extends BaseManager {}

export const __publicServiceEquityImpactScorerInternals = toolkit.internals;
