import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_human_approval_router',
    collectionField: 'approvalItems',
    idField: 'approvalId',
    defaultName: 'Education Approval Item',
    readyPosture: 'education_approval_routing_ready',
    defaultAgentId: 'agent:education-approval-router',
    recommendationTypes: {
        primary: 'route_education_human_approval',
        guard: 'mitigate_education_approval_queue_risk',
        audit: 'audit_education_approval_signals',
        publish: 'publish_education_approval_status'
    },
    recommendationTargetMap: {
        route_education_human_approval: 'agent:human-oversight',
        mitigate_education_approval_queue_risk: 'agent:education',
        audit_education_approval_signals: 'agent:trust',
        publish_education_approval_status: 'agent:ops'
    }
});

export function routeEducationHumanApprovals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationHumanApprovalRouterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationHumanApprovalRouter extends BaseManager {}

export const __educationHumanApprovalRouterInternals = toolkit.internals;
