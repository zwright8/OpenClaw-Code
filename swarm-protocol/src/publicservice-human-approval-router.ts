import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_human_approval_router',
    collectionField: 'approvalItems',
    idField: 'approvalId',
    defaultName: 'PublicService Approval Item',
    readyPosture: 'publicservice_approval_routing_ready',
    defaultAgentId: 'agent:publicservice-approval-router',
    recommendationTypes: {
        primary: 'route_publicservice_human_approval',
        guard: 'mitigate_publicservice_approval_queue_risk',
        audit: 'audit_publicservice_approval_signals',
        publish: 'publish_publicservice_approval_status'
    },
    recommendationTargetMap: {
        route_publicservice_human_approval: 'agent:human-oversight',
        mitigate_publicservice_approval_queue_risk: 'agent:publicservice',
        audit_publicservice_approval_signals: 'agent:trust',
        publish_publicservice_approval_status: 'agent:ops'
    }
});

export function routePublicServiceHumanApprovals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceHumanApprovalRouterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceHumanApprovalRouter extends BaseManager {}

export const __publicServiceHumanApprovalRouterInternals = toolkit.internals;
