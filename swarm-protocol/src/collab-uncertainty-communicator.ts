import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_uncertainty_communicator',
    collectionField: 'briefings',
    idField: 'briefingId',
    defaultName: 'Collab Briefing',
    readyPosture: 'collab_uncertainty_communication_ready',
    defaultAgentId: 'agent:collab-uncertainty',
    recommendationTypes: {
        primary: 'communicate_collab_uncertainty',
        guard: 'mitigate_collab_overconfidence_risk',
        audit: 'audit_collab_uncertainty_signals',
        publish: 'publish_collab_uncertainty_status'
    },
    recommendationTargetMap: {
        communicate_collab_uncertainty: 'agent:collab',
        mitigate_collab_overconfidence_risk: 'agent:risk',
        audit_collab_uncertainty_signals: 'agent:trust',
        publish_collab_uncertainty_status: 'agent:ops'
    }
});

export function communicateCollabUncertainty(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabUncertaintyCommunicatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabUncertaintyCommunicator extends BaseManager {}

export const __collabUncertaintyCommunicatorInternals = toolkit.internals;
