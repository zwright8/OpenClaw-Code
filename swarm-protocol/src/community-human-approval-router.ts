import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_human_approval_router',
    collectionField: 'approvalItems',
    idField: 'approvalId',
    defaultName: 'Community Approval Item',
    readyPosture: 'community_approval_routing_ready',
    defaultAgentId: 'agent:community-approval-router',
    recommendationTypes: {
        primary: 'route_community_human_approval',
        guard: 'mitigate_community_approval_queue_risk',
        audit: 'audit_community_approval_signals',
        publish: 'publish_community_approval_status'
    },
    recommendationTargetMap: {
        route_community_human_approval: 'agent:human-oversight',
        mitigate_community_approval_queue_risk: 'agent:community',
        audit_community_approval_signals: 'agent:trust',
        publish_community_approval_status: 'agent:ops'
    }
});

export function routeCommunityHumanApprovals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityHumanApprovalRouterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityHumanApprovalRouter extends BaseManager {}

export const __communityHumanApprovalRouterInternals = toolkit.internals;
