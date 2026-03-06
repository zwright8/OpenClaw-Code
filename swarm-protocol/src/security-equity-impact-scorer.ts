import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_equity_impact_scorer',
    collectionField: 'cohorts',
    idField: 'cohortId',
    defaultName: 'Security Cohort',
    readyPosture: 'security_equity_impact_scored',
    defaultAgentId: 'agent:security-equity-impact',
    recommendationTypes: {
        primary: 'score_security_equity_impact',
        guard: 'mitigate_security_uneven_outcome_risk',
        audit: 'audit_security_equity_impact_signals',
        publish: 'publish_security_equity_impact_status'
    },
    recommendationTargetMap: {
        score_security_equity_impact: 'agent:equity',
        mitigate_security_uneven_outcome_risk: 'agent:security',
        audit_security_equity_impact_signals: 'agent:trust',
        publish_security_equity_impact_status: 'agent:ops'
    }
});

export function scoreSecurityEquityImpact(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityEquityImpactScorerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityEquityImpactScorer extends BaseManager {}

export const __securityEquityImpactScorerInternals = toolkit.internals;
