import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'tooling_uncertainty_communicator',
    collectionField: 'briefings',
    idField: 'briefingId',
    defaultName: 'Briefing',
    readyPosture: 'uncertainty_communication_ready',
    defaultAgentId: 'agent:tooling-uncertainty',
    recommendationTypes: {
        primary: 'compose_uncertainty_brief',
        guard: 'mitigate_overconfidence_risk',
        audit: 'audit_uncertainty_signals',
        publish: 'publish_uncertainty_status'
    },
    recommendationTargetMap: {
        compose_uncertainty_brief: 'agent:communications',
        mitigate_overconfidence_risk: 'agent:governance',
        audit_uncertainty_signals: 'agent:trust',
        publish_uncertainty_status: 'agent:ops'
    }
});

export function communicateToolingUncertainty(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function toolingUncertaintyCommunicatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ToolingUncertaintyCommunicator extends BaseManager {}

export const __toolingUncertaintyCommunicatorInternals = toolkit.internals;
