import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_human_approval_router',
    collectionField: 'approvalItems',
    idField: 'approvalId',
    defaultName: 'Logistics Approval Item',
    readyPosture: 'logistics_approval_routing_ready',
    defaultAgentId: 'agent:logistics-approval-router',
    recommendationTypes: {
        primary: 'route_logistics_human_approval',
        guard: 'mitigate_logistics_approval_queue_risk',
        audit: 'audit_logistics_approval_signals',
        publish: 'publish_logistics_approval_status'
    },
    recommendationTargetMap: {
        route_logistics_human_approval: 'agent:human-oversight',
        mitigate_logistics_approval_queue_risk: 'agent:logistics',
        audit_logistics_approval_signals: 'agent:trust',
        publish_logistics_approval_status: 'agent:ops'
    }
});

export function routeLogisticsHumanApprovals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsHumanApprovalRouterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsHumanApprovalRouter extends BaseManager {}

export const __logisticsHumanApprovalRouterInternals = toolkit.internals;
