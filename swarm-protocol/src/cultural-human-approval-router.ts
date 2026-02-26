import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_human_approval_router',
    collectionField: 'approvalItems',
    idField: 'approvalId',
    defaultName: 'Cultural Approval Item',
    readyPosture: 'cultural_approval_routing_ready',
    defaultAgentId: 'agent:cultural-approval-router',
    recommendationTypes: {
        primary: 'route_cultural_human_approval',
        guard: 'mitigate_cultural_approval_queue_risk',
        audit: 'audit_cultural_approval_signals',
        publish: 'publish_cultural_approval_status'
    },
    recommendationTargetMap: {
        route_cultural_human_approval: 'agent:human-oversight',
        mitigate_cultural_approval_queue_risk: 'agent:cultural',
        audit_cultural_approval_signals: 'agent:trust',
        publish_cultural_approval_status: 'agent:ops'
    }
});

export function routeCulturalHumanApprovals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalHumanApprovalRouterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalHumanApprovalRouter extends BaseManager {}

export const __culturalHumanApprovalRouterInternals = toolkit.internals;
