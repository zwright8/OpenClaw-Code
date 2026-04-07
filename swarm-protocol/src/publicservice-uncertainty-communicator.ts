import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_uncertainty_communicator',
    collectionField: 'briefings',
    idField: 'briefingId',
    defaultName: 'PublicService Briefing',
    readyPosture: 'publicservice_uncertainty_communication_ready',
    defaultAgentId: 'agent:publicservice-uncertainty',
    recommendationTypes: {
        primary: 'communicate_publicservice_uncertainty',
        guard: 'mitigate_publicservice_overconfidence_risk',
        audit: 'audit_publicservice_uncertainty_signals',
        publish: 'publish_publicservice_uncertainty_status'
    },
    recommendationTargetMap: {
        communicate_publicservice_uncertainty: 'agent:publicservice',
        mitigate_publicservice_overconfidence_risk: 'agent:risk',
        audit_publicservice_uncertainty_signals: 'agent:trust',
        publish_publicservice_uncertainty_status: 'agent:ops'
    }
});

export function communicatePublicServiceUncertainty(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceUncertaintyCommunicatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceUncertaintyCommunicator extends BaseManager {}

export const __publicServiceUncertaintyCommunicatorInternals = toolkit.internals;
