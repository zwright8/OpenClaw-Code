import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_task_handoff_contractor',
    collectionField: 'handoffs',
    idField: 'handoffId',
    defaultName: 'Community Handoff',
    readyPosture: 'community_handoff_contract_ready',
    defaultAgentId: 'agent:community-handoff',
    recommendationTypes: {
        primary: 'contract_community_task_handoff',
        guard: 'mitigate_community_handoff_mismatch',
        audit: 'audit_community_handoff_signals',
        publish: 'publish_community_handoff_status'
    },
    recommendationTargetMap: {
        contract_community_task_handoff: 'agent:workflow',
        mitigate_community_handoff_mismatch: 'agent:community',
        audit_community_handoff_signals: 'agent:trust',
        publish_community_handoff_status: 'agent:ops'
    }
});

export function contractCommunityTaskHandoffs(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityTaskHandoffContractorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityTaskHandoffContractor extends BaseManager {}

export const __communityTaskHandoffContractorInternals = toolkit.internals;
