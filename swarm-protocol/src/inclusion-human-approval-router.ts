import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_human_approval_router',
    collectionField: 'approvalItems',
    idField: 'approvalId',
    defaultName: 'Inclusion Approval Item',
    readyPosture: 'inclusion_approval_routing_ready',
    defaultAgentId: 'agent:inclusion-approval-router',
    recommendationTypes: {
        primary: 'route_inclusion_human_approval',
        guard: 'mitigate_inclusion_approval_queue_risk',
        audit: 'audit_inclusion_approval_signals',
        publish: 'publish_inclusion_approval_status'
    },
    recommendationTargetMap: {
        route_inclusion_human_approval: 'agent:human-oversight',
        mitigate_inclusion_approval_queue_risk: 'agent:inclusion',
        audit_inclusion_approval_signals: 'agent:trust',
        publish_inclusion_approval_status: 'agent:ops'
    }
});

export function routeInclusionHumanApprovals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionHumanApprovalRouterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionHumanApprovalRouter extends BaseManager {}

export const __inclusionHumanApprovalRouterInternals = toolkit.internals;
