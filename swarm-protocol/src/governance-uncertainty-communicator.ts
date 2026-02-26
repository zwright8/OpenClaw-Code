import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_uncertainty_communicator',
    collectionField: 'briefings',
    idField: 'briefingId',
    defaultName: 'Governance Briefing',
    readyPosture: 'governance_uncertainty_communication_ready',
    defaultAgentId: 'agent:governance-uncertainty',
    recommendationTypes: {
        primary: 'communicate_governance_uncertainty',
        guard: 'mitigate_governance_overconfidence_risk',
        audit: 'audit_governance_uncertainty_signals',
        publish: 'publish_governance_uncertainty_status'
    },
    recommendationTargetMap: {
        communicate_governance_uncertainty: 'agent:governance',
        mitigate_governance_overconfidence_risk: 'agent:risk',
        audit_governance_uncertainty_signals: 'agent:trust',
        publish_governance_uncertainty_status: 'agent:ops'
    }
});

export function communicateGovernanceUncertainty(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceUncertaintyCommunicatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceUncertaintyCommunicator extends BaseManager {}

export const __governanceUncertaintyCommunicatorInternals = toolkit.internals;
