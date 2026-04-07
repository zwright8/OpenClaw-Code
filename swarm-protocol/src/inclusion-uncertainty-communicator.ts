import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_uncertainty_communicator',
    collectionField: 'briefings',
    idField: 'briefingId',
    defaultName: 'Inclusion Briefing',
    readyPosture: 'inclusion_uncertainty_calibrated',
    defaultAgentId: 'agent:inclusion-uncertainty',
    recommendationTypes: {
        primary: 'communicate_inclusion_uncertainty',
        guard: 'mitigate_inclusion_overconfidence_bias',
        audit: 'audit_inclusion_uncertainty_signals',
        publish: 'publish_inclusion_uncertainty_status'
    },
    recommendationTargetMap: {
        communicate_inclusion_uncertainty: 'agent:inclusion',
        mitigate_inclusion_overconfidence_bias: 'agent:policy',
        audit_inclusion_uncertainty_signals: 'agent:trust',
        publish_inclusion_uncertainty_status: 'agent:ops'
    }
});

export function communicateInclusionUncertainty(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionUncertaintyCommunicatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionUncertaintyCommunicator extends BaseManager {}

export const __inclusionUncertaintyCommunicatorInternals = toolkit.internals;
