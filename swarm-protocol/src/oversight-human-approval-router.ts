import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_human_approval_router',
    collectionField: 'approvalItems',
    idField: 'approvalId',
    defaultName: 'Oversight Approval Item',
    readyPosture: 'oversight_approval_routing_ready',
    defaultAgentId: 'agent:oversight-approval-router',
    recommendationTypes: {
        primary: 'route_oversight_human_approval',
        guard: 'mitigate_oversight_approval_queue_risk',
        audit: 'audit_oversight_approval_signals',
        publish: 'publish_oversight_approval_status'
    },
    recommendationTargetMap: {
        route_oversight_human_approval: 'agent:human-oversight',
        mitigate_oversight_approval_queue_risk: 'agent:oversight',
        audit_oversight_approval_signals: 'agent:trust',
        publish_oversight_approval_status: 'agent:ops'
    }
});

export function routeOversightHumanApprovals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightHumanApprovalRouterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightHumanApprovalRouter extends BaseManager {}

export const __oversightHumanApprovalRouterInternals = toolkit.internals;

