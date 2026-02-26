import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_human_approval_router',
    collectionField: 'approvalItems',
    idField: 'approvalId',
    defaultName: 'Engineering Approval Item',
    readyPosture: 'engineering_approval_routing_ready',
    defaultAgentId: 'agent:engineering-approval-router',
    recommendationTypes: {
        primary: 'route_engineering_human_approval',
        guard: 'mitigate_engineering_approval_queue_risk',
        audit: 'audit_engineering_approval_signals',
        publish: 'publish_engineering_approval_status'
    },
    recommendationTargetMap: {
        route_engineering_human_approval: 'agent:human-oversight',
        mitigate_engineering_approval_queue_risk: 'agent:engineering',
        audit_engineering_approval_signals: 'agent:trust',
        publish_engineering_approval_status: 'agent:ops'
    }
});

export function routeEngineeringHumanApprovals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringHumanApprovalRouterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringHumanApprovalRouter extends BaseManager {}

export const __engineeringHumanApprovalRouterInternals = toolkit.internals;
