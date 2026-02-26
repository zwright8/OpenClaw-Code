import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_human_approval_router',
    collectionField: 'approvalItems',
    idField: 'approvalId',
    defaultName: 'Economic Approval Item',
    readyPosture: 'economic_approval_routing_ready',
    defaultAgentId: 'agent:economic-approval-router',
    recommendationTypes: {
        primary: 'route_economic_human_approval',
        guard: 'mitigate_economic_approval_queue_risk',
        audit: 'audit_economic_approval_signals',
        publish: 'publish_economic_approval_status'
    },
    recommendationTargetMap: {
        route_economic_human_approval: 'agent:human-oversight',
        mitigate_economic_approval_queue_risk: 'agent:economic',
        audit_economic_approval_signals: 'agent:trust',
        publish_economic_approval_status: 'agent:ops'
    }
});

export function routeEconomicHumanApprovals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicHumanApprovalRouterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicHumanApprovalRouter extends BaseManager {}

export const __economicHumanApprovalRouterInternals = toolkit.internals;
