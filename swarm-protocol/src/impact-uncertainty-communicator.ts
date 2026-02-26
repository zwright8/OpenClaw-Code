import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_uncertainty_communicator',
    collectionField: 'briefings',
    idField: 'briefingId',
    defaultName: 'Impact Briefing',
    readyPosture: 'impact_uncertainty_communication_ready',
    defaultAgentId: 'agent:impact-uncertainty',
    recommendationTypes: {
        primary: 'communicate_impact_uncertainty',
        guard: 'mitigate_impact_overconfidence_risk',
        audit: 'audit_impact_uncertainty_signals',
        publish: 'publish_impact_uncertainty_status'
    },
    recommendationTargetMap: {
        communicate_impact_uncertainty: 'agent:impact',
        mitigate_impact_overconfidence_risk: 'agent:risk',
        audit_impact_uncertainty_signals: 'agent:trust',
        publish_impact_uncertainty_status: 'agent:ops'
    }
});

export function communicateImpactUncertainty(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactUncertaintyCommunicatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactUncertaintyCommunicator extends BaseManager {}

export const __impactUncertaintyCommunicatorInternals = toolkit.internals;
