import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_uncertainty_communicator',
    collectionField: 'briefings',
    idField: 'briefingId',
    defaultName: 'Logistics Briefing',
    readyPosture: 'logistics_uncertainty_communication_ready',
    defaultAgentId: 'agent:logistics-uncertainty',
    recommendationTypes: {
        primary: 'communicate_logistics_uncertainty',
        guard: 'mitigate_logistics_overconfidence_risk',
        audit: 'audit_logistics_uncertainty_signals',
        publish: 'publish_logistics_uncertainty_status'
    },
    recommendationTargetMap: {
        communicate_logistics_uncertainty: 'agent:logistics',
        mitigate_logistics_overconfidence_risk: 'agent:risk',
        audit_logistics_uncertainty_signals: 'agent:trust',
        publish_logistics_uncertainty_status: 'agent:ops'
    }
});

export function communicateLogisticsUncertainty(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsUncertaintyCommunicatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsUncertaintyCommunicator extends BaseManager {}

export const __logisticsUncertaintyCommunicatorInternals = toolkit.internals;
