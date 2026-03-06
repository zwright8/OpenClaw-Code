import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_uncertainty_communicator',
    collectionField: 'briefings',
    idField: 'briefingId',
    defaultName: 'Rights Briefing',
    readyPosture: 'rights_uncertainty_calibrated',
    defaultAgentId: 'agent:rights-uncertainty',
    recommendationTypes: {
        primary: 'communicate_rights_uncertainty',
        guard: 'mitigate_rights_overconfidence_bias',
        audit: 'audit_rights_uncertainty_signals',
        publish: 'publish_rights_uncertainty_status'
    },
    recommendationTargetMap: {
        communicate_rights_uncertainty: 'agent:rights',
        mitigate_rights_overconfidence_bias: 'agent:policy',
        audit_rights_uncertainty_signals: 'agent:trust',
        publish_rights_uncertainty_status: 'agent:ops'
    }
});

export function communicateRightsUncertainty(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsUncertaintyCommunicatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsUncertaintyCommunicator extends BaseManager {}

export const __rightsUncertaintyCommunicatorInternals = toolkit.internals;
