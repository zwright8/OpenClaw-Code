import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_human_approval_router',
    collectionField: 'approvalItems',
    idField: 'approvalId',
    defaultName: 'Infra Approval Item',
    readyPosture: 'infra_approval_routing_ready',
    defaultAgentId: 'agent:infra-approval-router',
    recommendationTypes: {
        primary: 'route_infra_human_approval',
        guard: 'mitigate_infra_approval_queue_risk',
        audit: 'audit_infra_approval_signals',
        publish: 'publish_infra_approval_status'
    },
    recommendationTargetMap: {
        route_infra_human_approval: 'agent:human-oversight',
        mitigate_infra_approval_queue_risk: 'agent:infra',
        audit_infra_approval_signals: 'agent:trust',
        publish_infra_approval_status: 'agent:ops'
    }
});

export function routeInfraHumanApprovals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraHumanApprovalRouterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraHumanApprovalRouter extends BaseManager {}

export const __infraHumanApprovalRouterInternals = toolkit.internals;
