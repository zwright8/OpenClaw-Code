import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_human_approval_router',
    collectionField: 'approvalItems',
    idField: 'approvalId',
    defaultName: 'Crisis Approval Item',
    readyPosture: 'crisis_approval_routing_ready',
    defaultAgentId: 'agent:crisis-approval-router',
    recommendationTypes: {
        primary: 'route_crisis_human_approval',
        guard: 'mitigate_crisis_approval_queue_risk',
        audit: 'audit_crisis_approval_signals',
        publish: 'publish_crisis_approval_status'
    },
    recommendationTargetMap: {
        route_crisis_human_approval: 'agent:human-oversight',
        mitigate_crisis_approval_queue_risk: 'agent:crisis',
        audit_crisis_approval_signals: 'agent:trust',
        publish_crisis_approval_status: 'agent:ops'
    }
});

export function routeCrisisHumanApprovals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisHumanApprovalRouterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisHumanApprovalRouter extends BaseManager {}

export const __crisisHumanApprovalRouterInternals = toolkit.internals;
