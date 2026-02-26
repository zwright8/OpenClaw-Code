import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_uncertainty_communicator',
    collectionField: 'briefings',
    idField: 'briefingId',
    defaultName: 'Security Briefing',
    readyPosture: 'security_uncertainty_communication_ready',
    defaultAgentId: 'agent:security-uncertainty',
    recommendationTypes: {
        primary: 'communicate_security_uncertainty',
        guard: 'mitigate_security_overconfidence_risk',
        audit: 'audit_security_uncertainty_signals',
        publish: 'publish_security_uncertainty_status'
    },
    recommendationTargetMap: {
        communicate_security_uncertainty: 'agent:security',
        mitigate_security_overconfidence_risk: 'agent:risk',
        audit_security_uncertainty_signals: 'agent:trust',
        publish_security_uncertainty_status: 'agent:ops'
    }
});

export function communicateSecurityUncertainty(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityUncertaintyCommunicatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityUncertaintyCommunicator extends BaseManager {}

export const __securityUncertaintyCommunicatorInternals = toolkit.internals;
