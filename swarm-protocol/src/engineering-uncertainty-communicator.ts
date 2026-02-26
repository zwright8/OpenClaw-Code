import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_uncertainty_communicator',
    collectionField: 'briefings',
    idField: 'briefingId',
    defaultName: 'Engineering Briefing',
    readyPosture: 'engineering_uncertainty_communication_ready',
    defaultAgentId: 'agent:engineering-uncertainty',
    recommendationTypes: {
        primary: 'communicate_engineering_uncertainty',
        guard: 'mitigate_engineering_overconfidence_risk',
        audit: 'audit_engineering_uncertainty_signals',
        publish: 'publish_engineering_uncertainty_status'
    },
    recommendationTargetMap: {
        communicate_engineering_uncertainty: 'agent:engineering',
        mitigate_engineering_overconfidence_risk: 'agent:risk',
        audit_engineering_uncertainty_signals: 'agent:trust',
        publish_engineering_uncertainty_status: 'agent:ops'
    }
});

export function communicateEngineeringUncertainty(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringUncertaintyCommunicatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringUncertaintyCommunicator extends BaseManager {}

export const __engineeringUncertaintyCommunicatorInternals = toolkit.internals;
