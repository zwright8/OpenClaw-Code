import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_uncertainty_communicator',
    collectionField: 'briefings',
    idField: 'briefingId',
    defaultName: 'Economic Briefing',
    readyPosture: 'economic_uncertainty_communication_ready',
    defaultAgentId: 'agent:economic-uncertainty',
    recommendationTypes: {
        primary: 'communicate_economic_uncertainty',
        guard: 'mitigate_economic_overconfidence_risk',
        audit: 'audit_economic_uncertainty_signals',
        publish: 'publish_economic_uncertainty_status'
    },
    recommendationTargetMap: {
        communicate_economic_uncertainty: 'agent:economic',
        mitigate_economic_overconfidence_risk: 'agent:risk',
        audit_economic_uncertainty_signals: 'agent:trust',
        publish_economic_uncertainty_status: 'agent:ops'
    }
});

export function communicateEconomicUncertainty(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicUncertaintyCommunicatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicUncertaintyCommunicator extends BaseManager {}

export const __economicUncertaintyCommunicatorInternals = toolkit.internals;
