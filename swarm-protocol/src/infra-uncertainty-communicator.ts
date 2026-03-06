import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_uncertainty_communicator',
    collectionField: 'briefings',
    idField: 'briefingId',
    defaultName: 'Infra Briefing',
    readyPosture: 'infra_uncertainty_calibrated',
    defaultAgentId: 'agent:infra-uncertainty',
    recommendationTypes: {
        primary: 'communicate_infra_uncertainty',
        guard: 'mitigate_infra_overconfidence_bias',
        audit: 'audit_infra_uncertainty_signals',
        publish: 'publish_infra_uncertainty_status'
    },
    recommendationTargetMap: {
        communicate_infra_uncertainty: 'agent:infra',
        mitigate_infra_overconfidence_bias: 'agent:policy',
        audit_infra_uncertainty_signals: 'agent:trust',
        publish_infra_uncertainty_status: 'agent:ops'
    }
});

export function communicateInfraUncertainty(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraUncertaintyCommunicatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraUncertaintyCommunicator extends BaseManager {}

export const __infraUncertaintyCommunicatorInternals = toolkit.internals;
