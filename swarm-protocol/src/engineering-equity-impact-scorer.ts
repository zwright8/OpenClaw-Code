import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_equity_impact_scorer',
    collectionField: 'cohorts',
    idField: 'cohortId',
    defaultName: 'Engineering Cohort',
    readyPosture: 'engineering_equity_impact_scored',
    defaultAgentId: 'agent:engineering-equity-impact',
    recommendationTypes: {
        primary: 'score_engineering_equity_impact',
        guard: 'mitigate_engineering_uneven_outcome_risk',
        audit: 'audit_engineering_equity_impact_signals',
        publish: 'publish_engineering_equity_impact_status'
    },
    recommendationTargetMap: {
        score_engineering_equity_impact: 'agent:equity',
        mitigate_engineering_uneven_outcome_risk: 'agent:engineering',
        audit_engineering_equity_impact_signals: 'agent:trust',
        publish_engineering_equity_impact_status: 'agent:ops'
    }
});

export function scoreEngineeringEquityImpact(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringEquityImpactScorerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringEquityImpactScorer extends BaseManager {}

export const __engineeringEquityImpactScorerInternals = toolkit.internals;
