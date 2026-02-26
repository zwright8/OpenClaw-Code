import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_human_approval_router',
    collectionField: 'approvalItems',
    idField: 'approvalId',
    defaultName: 'Evolution Approval Item',
    readyPosture: 'evolution_approval_routing_ready',
    defaultAgentId: 'agent:evolution-approval-router',
    recommendationTypes: {
        primary: 'route_evolution_human_approval',
        guard: 'mitigate_evolution_approval_queue_risk',
        audit: 'audit_evolution_approval_signals',
        publish: 'publish_evolution_approval_status'
    },
    recommendationTargetMap: {
        route_evolution_human_approval: 'agent:human-oversight',
        mitigate_evolution_approval_queue_risk: 'agent:evolution',
        audit_evolution_approval_signals: 'agent:trust',
        publish_evolution_approval_status: 'agent:ops'
    }
});

export function routeEvolutionHumanApprovals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionHumanApprovalRouterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionHumanApprovalRouter extends BaseManager {}

export const __evolutionHumanApprovalRouterInternals = toolkit.internals;
