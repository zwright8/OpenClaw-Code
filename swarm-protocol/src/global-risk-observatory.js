import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'global_risk_observatory',
    collectionField: 'riskSignals',
    idField: 'signalId',
    defaultName: 'Risk Signal',
    readyPosture: 'global_risk_observed',
    defaultAgentId: 'agent:global-risk-observatory',
    recommendationTypes: {
        primary: 'escalate_global_risk_signal',
        guard: 'strengthen_global_risk_monitoring',
        audit: 'audit_global_risk_evidence',
        publish: 'publish_global_risk_bulletin'
    },
    recommendationTargetMap: {
        escalate_global_risk_signal: 'agent:risk',
        strengthen_global_risk_monitoring: 'agent:observability',
        audit_global_risk_evidence: 'agent:trust',
        publish_global_risk_bulletin: 'agent:ops'
    }
});

export function observeGlobalRisks(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function globalRiskObservatoryToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GlobalRiskObservatory extends BaseManager {}

export const __globalRiskObservatoryInternals = toolkit.internals;
