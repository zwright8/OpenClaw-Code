import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_equity_impact_scorer',
    collectionField: 'cohorts',
    idField: 'cohortId',
    defaultName: 'Collab Cohort',
    readyPosture: 'collab_equity_impact_scored',
    defaultAgentId: 'agent:collab-equity-impact',
    recommendationTypes: {
        primary: 'score_collab_equity_impact',
        guard: 'mitigate_collab_uneven_outcome_risk',
        audit: 'audit_collab_equity_impact_signals',
        publish: 'publish_collab_equity_impact_status'
    },
    recommendationTargetMap: {
        score_collab_equity_impact: 'agent:equity',
        mitigate_collab_uneven_outcome_risk: 'agent:collab',
        audit_collab_equity_impact_signals: 'agent:trust',
        publish_collab_equity_impact_status: 'agent:ops'
    }
});

export function scoreCollabEquityImpact(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabEquityImpactScorerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabEquityImpactScorer extends BaseManager {}

export const __collabEquityImpactScorerInternals = toolkit.internals;
