import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_human_approval_router',
    collectionField: 'approvalItems',
    idField: 'approvalId',
    defaultName: 'Collab Approval Item',
    readyPosture: 'collab_approval_routing_ready',
    defaultAgentId: 'agent:collab-approval-router',
    recommendationTypes: {
        primary: 'route_collab_human_approval',
        guard: 'mitigate_collab_approval_queue_risk',
        audit: 'audit_collab_approval_signals',
        publish: 'publish_collab_approval_status'
    },
    recommendationTargetMap: {
        route_collab_human_approval: 'agent:human-oversight',
        mitigate_collab_approval_queue_risk: 'agent:collab',
        audit_collab_approval_signals: 'agent:trust',
        publish_collab_approval_status: 'agent:ops'
    }
});

export function routeCollabHumanApprovals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabHumanApprovalRouterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabHumanApprovalRouter extends BaseManager {}

export const __collabHumanApprovalRouterInternals = toolkit.internals;
