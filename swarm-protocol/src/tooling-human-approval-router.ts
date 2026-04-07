import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'tooling_human_approval_router',
    collectionField: 'approvalItems',
    idField: 'approvalId',
    defaultName: 'Approval Item',
    readyPosture: 'approval_routing_ready',
    defaultAgentId: 'agent:tooling-approval-router',
    recommendationTypes: {
        primary: 'route_high_risk_approval',
        guard: 'mitigate_approval_queue_risk',
        audit: 'audit_approval_router_signals',
        publish: 'publish_approval_router_status'
    },
    recommendationTargetMap: {
        route_high_risk_approval: 'agent:human-oversight',
        mitigate_approval_queue_risk: 'agent:governance',
        audit_approval_router_signals: 'agent:trust',
        publish_approval_router_status: 'agent:ops'
    }
});

export function routeToolingHumanApprovals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function toolingHumanApprovalRouterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ToolingHumanApprovalRouter extends BaseManager {}

export const __toolingHumanApprovalRouterInternals = toolkit.internals;
