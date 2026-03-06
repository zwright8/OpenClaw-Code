import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_human_approval_router',
    collectionField: 'approvalItems',
    idField: 'approvalId',
    defaultName: 'Federation Approval Item',
    readyPosture: 'federation_approval_routing_ready',
    defaultAgentId: 'agent:federation-approval-router',
    recommendationTypes: {
        primary: 'route_federation_human_approval',
        guard: 'mitigate_federation_approval_queue_risk',
        audit: 'audit_federation_approval_signals',
        publish: 'publish_federation_approval_status'
    },
    recommendationTargetMap: {
        route_federation_human_approval: 'agent:human-oversight',
        mitigate_federation_approval_queue_risk: 'agent:federation',
        audit_federation_approval_signals: 'agent:trust',
        publish_federation_approval_status: 'agent:ops'
    }
});

export function routeFederationHumanApprovals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationHumanApprovalRouterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationHumanApprovalRouter extends BaseManager {}

export const __federationHumanApprovalRouterInternals = toolkit.internals;
