import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_uncertainty_communicator',
    collectionField: 'briefings',
    idField: 'briefingId',
    defaultName: 'Crisis Briefing',
    readyPosture: 'crisis_uncertainty_communication_ready',
    defaultAgentId: 'agent:crisis-uncertainty',
    recommendationTypes: {
        primary: 'communicate_crisis_uncertainty',
        guard: 'mitigate_crisis_overconfidence_risk',
        audit: 'audit_crisis_uncertainty_signals',
        publish: 'publish_crisis_uncertainty_status'
    },
    recommendationTargetMap: {
        communicate_crisis_uncertainty: 'agent:crisis',
        mitigate_crisis_overconfidence_risk: 'agent:risk',
        audit_crisis_uncertainty_signals: 'agent:trust',
        publish_crisis_uncertainty_status: 'agent:ops'
    }
});

export function communicateCrisisUncertainty(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisUncertaintyCommunicatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisUncertaintyCommunicator extends BaseManager {}

export const __crisisUncertaintyCommunicatorInternals = toolkit.internals;
