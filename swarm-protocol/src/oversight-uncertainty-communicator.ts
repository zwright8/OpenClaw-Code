import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_uncertainty_communicator',
    collectionField: 'briefings',
    idField: 'briefingId',
    defaultName: 'Oversight Briefing',
    readyPosture: 'oversight_uncertainty_communication_ready',
    defaultAgentId: 'agent:oversight-uncertainty',
    recommendationTypes: {
        primary: 'communicate_oversight_uncertainty',
        guard: 'mitigate_oversight_overconfidence_risk',
        audit: 'audit_oversight_uncertainty_signals',
        publish: 'publish_oversight_uncertainty_status'
    },
    recommendationTargetMap: {
        communicate_oversight_uncertainty: 'agent:oversight',
        mitigate_oversight_overconfidence_risk: 'agent:risk',
        audit_oversight_uncertainty_signals: 'agent:trust',
        publish_oversight_uncertainty_status: 'agent:ops'
    }
});

export function communicateOversightUncertainty(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightUncertaintyCommunicatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightUncertaintyCommunicator extends BaseManager {}

export const __oversightUncertaintyCommunicatorInternals = toolkit.internals;
