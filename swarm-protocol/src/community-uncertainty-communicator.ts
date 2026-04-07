import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_uncertainty_communicator',
    collectionField: 'briefings',
    idField: 'briefingId',
    defaultName: 'Community Briefing',
    readyPosture: 'community_uncertainty_calibrated',
    defaultAgentId: 'agent:community-uncertainty',
    recommendationTypes: {
        primary: 'communicate_community_uncertainty',
        guard: 'mitigate_community_overconfidence_bias',
        audit: 'audit_community_uncertainty_signals',
        publish: 'publish_community_uncertainty_status'
    },
    recommendationTargetMap: {
        communicate_community_uncertainty: 'agent:community',
        mitigate_community_overconfidence_bias: 'agent:policy',
        audit_community_uncertainty_signals: 'agent:trust',
        publish_community_uncertainty_status: 'agent:ops'
    }
});

export function communicateCommunityUncertainty(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityUncertaintyCommunicatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityUncertaintyCommunicator extends BaseManager {}

export const __communityUncertaintyCommunicatorInternals = toolkit.internals;
