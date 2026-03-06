import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_uncertainty_communicator',
    collectionField: 'briefings',
    idField: 'briefingId',
    defaultName: 'Comms Briefing',
    readyPosture: 'comms_uncertainty_communication_ready',
    defaultAgentId: 'agent:comms-uncertainty',
    recommendationTypes: {
        primary: 'communicate_comms_uncertainty',
        guard: 'mitigate_comms_overconfidence_risk',
        audit: 'audit_comms_uncertainty_signals',
        publish: 'publish_comms_uncertainty_status'
    },
    recommendationTargetMap: {
        communicate_comms_uncertainty: 'agent:comms',
        mitigate_comms_overconfidence_risk: 'agent:risk',
        audit_comms_uncertainty_signals: 'agent:trust',
        publish_comms_uncertainty_status: 'agent:ops'
    }
});

export function communicateCommsUncertainty(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsUncertaintyCommunicatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsUncertaintyCommunicator extends BaseManager {}

export const __commsUncertaintyCommunicatorInternals = toolkit.internals;
