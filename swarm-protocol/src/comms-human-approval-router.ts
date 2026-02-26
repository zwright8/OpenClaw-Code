import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_human_approval_router',
    collectionField: 'approvalItems',
    idField: 'approvalId',
    defaultName: 'Comms Approval Item',
    readyPosture: 'comms_approval_routing_ready',
    defaultAgentId: 'agent:comms-approval-router',
    recommendationTypes: {
        primary: 'route_comms_human_approval',
        guard: 'mitigate_comms_approval_queue_risk',
        audit: 'audit_comms_approval_signals',
        publish: 'publish_comms_approval_status'
    },
    recommendationTargetMap: {
        route_comms_human_approval: 'agent:human-oversight',
        mitigate_comms_approval_queue_risk: 'agent:comms',
        audit_comms_approval_signals: 'agent:trust',
        publish_comms_approval_status: 'agent:ops'
    }
});

export function routeCommsHumanApprovals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsHumanApprovalRouterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsHumanApprovalRouter extends BaseManager {}

export const __commsHumanApprovalRouterInternals = toolkit.internals;
