import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_equity_impact_scorer',
    collectionField: 'cohorts',
    idField: 'cohortId',
    defaultName: 'Education Cohort',
    readyPosture: 'education_equity_impact_scored',
    defaultAgentId: 'agent:education-equity-impact',
    recommendationTypes: {
        primary: 'score_education_equity_impact',
        guard: 'mitigate_education_uneven_outcome_risk',
        audit: 'audit_education_equity_impact_signals',
        publish: 'publish_education_equity_impact_status'
    },
    recommendationTargetMap: {
        score_education_equity_impact: 'agent:equity',
        mitigate_education_uneven_outcome_risk: 'agent:education',
        audit_education_equity_impact_signals: 'agent:trust',
        publish_education_equity_impact_status: 'agent:ops'
    }
});

export function scoreEducationEquityImpact(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationEquityImpactScorerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationEquityImpactScorer extends BaseManager {}

export const __educationEquityImpactScorerInternals = toolkit.internals;
