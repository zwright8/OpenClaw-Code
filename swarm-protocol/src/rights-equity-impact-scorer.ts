import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_equity_impact_scorer',
    collectionField: 'cohorts',
    idField: 'cohortId',
    defaultName: 'Rights Cohort',
    readyPosture: 'rights_equity_impact_scored',
    defaultAgentId: 'agent:rights-equity-impact',
    recommendationTypes: {
        primary: 'score_rights_equity_impact',
        guard: 'mitigate_rights_inequitable_outcome_risk',
        audit: 'audit_rights_equity_impact_signals',
        publish: 'publish_rights_equity_impact_status'
    },
    recommendationTargetMap: {
        score_rights_equity_impact: 'agent:rights',
        mitigate_rights_inequitable_outcome_risk: 'agent:policy',
        audit_rights_equity_impact_signals: 'agent:trust',
        publish_rights_equity_impact_status: 'agent:ops'
    }
});

export function scoreRightsEquityImpact(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsEquityImpactScorerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsEquityImpactScorer extends BaseManager {}

export const __rightsEquityImpactScorerInternals = toolkit.internals;
