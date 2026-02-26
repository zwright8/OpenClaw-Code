import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_human_approval_router',
    collectionField: 'approvalItems',
    idField: 'approvalId',
    defaultName: 'Impact Approval Item',
    readyPosture: 'impact_approval_routing_ready',
    defaultAgentId: 'agent:impact-approval-router',
    recommendationTypes: {
        primary: 'route_impact_human_approval',
        guard: 'mitigate_impact_approval_queue_risk',
        audit: 'audit_impact_approval_signals',
        publish: 'publish_impact_approval_status'
    },
    recommendationTargetMap: {
        route_impact_human_approval: 'agent:human-oversight',
        mitigate_impact_approval_queue_risk: 'agent:impact',
        audit_impact_approval_signals: 'agent:trust',
        publish_impact_approval_status: 'agent:ops'
    }
});

export function routeImpactHumanApprovals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactHumanApprovalRouterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactHumanApprovalRouter extends BaseManager {}

export const __impactHumanApprovalRouterInternals = toolkit.internals;
