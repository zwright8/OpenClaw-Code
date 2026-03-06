import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_human_approval_router',
    collectionField: 'approvalItems',
    idField: 'approvalId',
    defaultName: 'Security Approval Item',
    readyPosture: 'security_approval_routing_ready',
    defaultAgentId: 'agent:security-approval-router',
    recommendationTypes: {
        primary: 'route_security_human_approval',
        guard: 'mitigate_security_approval_queue_risk',
        audit: 'audit_security_approval_signals',
        publish: 'publish_security_approval_status'
    },
    recommendationTargetMap: {
        route_security_human_approval: 'agent:human-oversight',
        mitigate_security_approval_queue_risk: 'agent:security',
        audit_security_approval_signals: 'agent:trust',
        publish_security_approval_status: 'agent:ops'
    }
});

export function routeSecurityHumanApprovals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityHumanApprovalRouterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityHumanApprovalRouter extends BaseManager {}

export const __securityHumanApprovalRouterInternals = toolkit.internals;
