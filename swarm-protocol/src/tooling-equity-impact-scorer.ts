import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'tooling_equity_impact_scorer',
    collectionField: 'cohorts',
    idField: 'cohortId',
    defaultName: 'Cohort',
    readyPosture: 'equity_impact_scored',
    defaultAgentId: 'agent:tooling-equity-impact',
    recommendationTypes: {
        primary: 'score_tooling_equity_impact',
        guard: 'mitigate_uneven_outcome_risk',
        audit: 'audit_equity_impact_signals',
        publish: 'publish_equity_impact_status'
    },
    recommendationTargetMap: {
        score_tooling_equity_impact: 'agent:equity',
        mitigate_uneven_outcome_risk: 'agent:governance',
        audit_equity_impact_signals: 'agent:trust',
        publish_equity_impact_status: 'agent:ops'
    }
});

export function scoreToolingEquityImpact(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function toolingEquityImpactScorerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ToolingEquityImpactScorer extends BaseManager {}

export const __toolingEquityImpactScorerInternals = toolkit.internals;
