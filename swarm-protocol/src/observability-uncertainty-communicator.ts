import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_uncertainty_communicator',
    collectionField: 'briefings',
    idField: 'briefingId',
    defaultName: 'Observability Briefing',
    readyPosture: 'observability_uncertainty_communication_ready',
    defaultAgentId: 'agent:observability-uncertainty',
    recommendationTypes: {
        primary: 'communicate_observability_uncertainty',
        guard: 'mitigate_observability_overconfidence_risk',
        audit: 'audit_observability_uncertainty_signals',
        publish: 'publish_observability_uncertainty_status'
    },
    recommendationTargetMap: {
        communicate_observability_uncertainty: 'agent:observability',
        mitigate_observability_overconfidence_risk: 'agent:risk',
        audit_observability_uncertainty_signals: 'agent:trust',
        publish_observability_uncertainty_status: 'agent:ops'
    }
});

export function communicateObservabilityUncertainty(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityUncertaintyCommunicatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityUncertaintyCommunicator extends BaseManager {}

export const __observabilityUncertaintyCommunicatorInternals = toolkit.internals;
