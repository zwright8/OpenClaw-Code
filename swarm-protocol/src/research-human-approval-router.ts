import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_human_approval_router',
    collectionField: 'approvalItems',
    idField: 'approvalId',
    defaultName: 'Research Approval Item',
    readyPosture: 'research_approval_routing_ready',
    defaultAgentId: 'agent:research-approval-router',
    recommendationTypes: {
        primary: 'route_research_human_approval',
        guard: 'mitigate_research_approval_queue_risk',
        audit: 'audit_research_approval_signals',
        publish: 'publish_research_approval_status'
    },
    recommendationTargetMap: {
        route_research_human_approval: 'agent:human-oversight',
        mitigate_research_approval_queue_risk: 'agent:research',
        audit_research_approval_signals: 'agent:trust',
        publish_research_approval_status: 'agent:ops'
    }
});

export function routeResearchHumanApprovals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchHumanApprovalRouterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchHumanApprovalRouter extends BaseManager {}

export const __researchHumanApprovalRouterInternals = toolkit.internals;
