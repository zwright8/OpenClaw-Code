import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_uncertainty_communicator',
    collectionField: 'briefings',
    idField: 'briefingId',
    defaultName: 'Federation Briefing',
    readyPosture: 'federation_uncertainty_communication_ready',
    defaultAgentId: 'agent:federation-uncertainty',
    recommendationTypes: {
        primary: 'communicate_federation_uncertainty',
        guard: 'mitigate_federation_overconfidence_risk',
        audit: 'audit_federation_uncertainty_signals',
        publish: 'publish_federation_uncertainty_status'
    },
    recommendationTargetMap: {
        communicate_federation_uncertainty: 'agent:federation',
        mitigate_federation_overconfidence_risk: 'agent:risk',
        audit_federation_uncertainty_signals: 'agent:trust',
        publish_federation_uncertainty_status: 'agent:ops'
    }
});

export function communicateFederationUncertainty(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationUncertaintyCommunicatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationUncertaintyCommunicator extends BaseManager {}

export const __federationUncertaintyCommunicatorInternals = toolkit.internals;
