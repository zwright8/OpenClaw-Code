import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_human_approval_router',
    collectionField: 'approvalItems',
    idField: 'approvalId',
    defaultName: 'Rights Approval Item',
    readyPosture: 'rights_approval_routing_ready',
    defaultAgentId: 'agent:rights-approval-router',
    recommendationTypes: {
        primary: 'route_rights_human_approval',
        guard: 'mitigate_rights_approval_queue_risk',
        audit: 'audit_rights_approval_signals',
        publish: 'publish_rights_approval_status'
    },
    recommendationTargetMap: {
        route_rights_human_approval: 'agent:human-oversight',
        mitigate_rights_approval_queue_risk: 'agent:rights',
        audit_rights_approval_signals: 'agent:trust',
        publish_rights_approval_status: 'agent:ops'
    }
});

export function routeRightsHumanApprovals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsHumanApprovalRouterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsHumanApprovalRouter extends BaseManager {}

export const __rightsHumanApprovalRouterInternals = toolkit.internals;
