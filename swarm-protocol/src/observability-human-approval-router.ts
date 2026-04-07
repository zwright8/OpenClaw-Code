import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_human_approval_router',
    collectionField: 'approvalItems',
    idField: 'approvalId',
    defaultName: 'Observability Approval Item',
    readyPosture: 'observability_approval_routing_ready',
    defaultAgentId: 'agent:observability-approval-router',
    recommendationTypes: {
        primary: 'route_observability_human_approval',
        guard: 'mitigate_observability_approval_queue_risk',
        audit: 'audit_observability_approval_signals',
        publish: 'publish_observability_approval_status'
    },
    recommendationTargetMap: {
        route_observability_human_approval: 'agent:human-oversight',
        mitigate_observability_approval_queue_risk: 'agent:observability',
        audit_observability_approval_signals: 'agent:trust',
        publish_observability_approval_status: 'agent:ops'
    }
});

export function routeObservabilityHumanApprovals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityHumanApprovalRouterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityHumanApprovalRouter extends BaseManager {}

export const __observabilityHumanApprovalRouterInternals = toolkit.internals;
