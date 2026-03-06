import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_equity_impact_scorer',
    collectionField: 'cohorts',
    idField: 'cohortId',
    defaultName: 'Comms Cohort',
    readyPosture: 'comms_equity_impact_scored',
    defaultAgentId: 'agent:comms-equity-impact',
    recommendationTypes: {
        primary: 'score_comms_equity_impact',
        guard: 'mitigate_comms_uneven_outcome_risk',
        audit: 'audit_comms_equity_impact_signals',
        publish: 'publish_comms_equity_impact_status'
    },
    recommendationTargetMap: {
        score_comms_equity_impact: 'agent:equity',
        mitigate_comms_uneven_outcome_risk: 'agent:comms',
        audit_comms_equity_impact_signals: 'agent:trust',
        publish_comms_equity_impact_status: 'agent:ops'
    }
});

export function scoreCommsEquityImpact(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsEquityImpactScorerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsEquityImpactScorer extends BaseManager {}

export const __commsEquityImpactScorerInternals = toolkit.internals;
