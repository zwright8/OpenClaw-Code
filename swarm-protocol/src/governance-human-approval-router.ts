import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_human_approval_router',
    collectionField: 'approvalItems',
    idField: 'approvalId',
    defaultName: 'Governance Approval Item',
    readyPosture: 'governance_approval_routing_ready',
    defaultAgentId: 'agent:governance-approval-router',
    recommendationTypes: {
        primary: 'route_governance_human_approval',
        guard: 'mitigate_governance_approval_queue_risk',
        audit: 'audit_governance_approval_signals',
        publish: 'publish_governance_approval_status'
    },
    recommendationTargetMap: {
        route_governance_human_approval: 'agent:human-oversight',
        mitigate_governance_approval_queue_risk: 'agent:governance',
        audit_governance_approval_signals: 'agent:trust',
        publish_governance_approval_status: 'agent:ops'
    }
});

export function routeGovernanceHumanApprovals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceHumanApprovalRouterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceHumanApprovalRouter extends BaseManager {}

export const __governanceHumanApprovalRouterInternals = toolkit.internals;
