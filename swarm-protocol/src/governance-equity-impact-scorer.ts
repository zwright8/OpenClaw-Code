import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_equity_impact_scorer',
    collectionField: 'cohorts',
    idField: 'cohortId',
    defaultName: 'Governance Cohort',
    readyPosture: 'governance_equity_impact_scored',
    defaultAgentId: 'agent:governance-equity-impact',
    recommendationTypes: {
        primary: 'score_governance_equity_impact',
        guard: 'mitigate_governance_uneven_outcome_risk',
        audit: 'audit_governance_equity_impact_signals',
        publish: 'publish_governance_equity_impact_status'
    },
    recommendationTargetMap: {
        score_governance_equity_impact: 'agent:equity',
        mitigate_governance_uneven_outcome_risk: 'agent:governance',
        audit_governance_equity_impact_signals: 'agent:trust',
        publish_governance_equity_impact_status: 'agent:ops'
    }
});

export function scoreGovernanceEquityImpact(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceEquityImpactScorerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceEquityImpactScorer extends BaseManager {}

export const __governanceEquityImpactScorerInternals = toolkit.internals;
