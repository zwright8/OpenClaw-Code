import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_uncertainty_communicator',
    collectionField: 'briefings',
    idField: 'briefingId',
    defaultName: 'Education Briefing',
    readyPosture: 'education_uncertainty_communication_ready',
    defaultAgentId: 'agent:education-uncertainty',
    recommendationTypes: {
        primary: 'communicate_education_uncertainty',
        guard: 'mitigate_education_overconfidence_risk',
        audit: 'audit_education_uncertainty_signals',
        publish: 'publish_education_uncertainty_status'
    },
    recommendationTargetMap: {
        communicate_education_uncertainty: 'agent:education',
        mitigate_education_overconfidence_risk: 'agent:risk',
        audit_education_uncertainty_signals: 'agent:trust',
        publish_education_uncertainty_status: 'agent:ops'
    }
});

export function communicateEducationUncertainty(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationUncertaintyCommunicatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationUncertaintyCommunicator extends BaseManager {}

export const __educationUncertaintyCommunicatorInternals = toolkit.internals;
