import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_uncertainty_communicator',
    collectionField: 'briefings',
    idField: 'briefingId',
    defaultName: 'Cultural Briefing',
    readyPosture: 'cultural_uncertainty_calibrated',
    defaultAgentId: 'agent:cultural-uncertainty',
    recommendationTypes: {
        primary: 'communicate_cultural_uncertainty',
        guard: 'mitigate_cultural_overconfidence_bias',
        audit: 'audit_cultural_uncertainty_signals',
        publish: 'publish_cultural_uncertainty_status'
    },
    recommendationTargetMap: {
        communicate_cultural_uncertainty: 'agent:cultural',
        mitigate_cultural_overconfidence_bias: 'agent:policy',
        audit_cultural_uncertainty_signals: 'agent:trust',
        publish_cultural_uncertainty_status: 'agent:ops'
    }
});

export function communicateCulturalUncertainty(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalUncertaintyCommunicatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalUncertaintyCommunicator extends BaseManager {}

export const __culturalUncertaintyCommunicatorInternals = toolkit.internals;
