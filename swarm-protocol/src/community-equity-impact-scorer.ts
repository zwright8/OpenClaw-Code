import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_equity_impact_scorer',
    collectionField: 'cohorts',
    idField: 'cohortId',
    defaultName: 'Community Cohort',
    readyPosture: 'community_equity_impact_scored',
    defaultAgentId: 'agent:community-equity-impact',
    recommendationTypes: {
        primary: 'score_community_equity_impact',
        guard: 'mitigate_community_uneven_outcome_risk',
        audit: 'audit_community_equity_impact_signals',
        publish: 'publish_community_equity_impact_status'
    },
    recommendationTargetMap: {
        score_community_equity_impact: 'agent:equity',
        mitigate_community_uneven_outcome_risk: 'agent:community',
        audit_community_equity_impact_signals: 'agent:trust',
        publish_community_equity_impact_status: 'agent:ops'
    }
});

export function scoreCommunityEquityImpact(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityEquityImpactScorerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityEquityImpactScorer extends BaseManager {}

export const __communityEquityImpactScorerInternals = toolkit.internals;
