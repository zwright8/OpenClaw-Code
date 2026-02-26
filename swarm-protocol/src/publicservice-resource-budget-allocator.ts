import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_resource_budget_allocator',
    collectionField: 'budgetItems',
    idField: 'itemId',
    defaultName: 'PublicService Budget Item',
    readyPosture: 'publicservice_budget_allocation_ready',
    defaultAgentId: 'agent:publicservice-budget',
    recommendationTypes: {
        primary: 'allocate_publicservice_resource_budget',
        guard: 'mitigate_publicservice_overcommitment_risk',
        audit: 'audit_publicservice_budget_signals',
        publish: 'publish_publicservice_budget_status'
    },
    recommendationTargetMap: {
        allocate_publicservice_resource_budget: 'agent:publicservice',
        mitigate_publicservice_overcommitment_risk: 'agent:finance',
        audit_publicservice_budget_signals: 'agent:trust',
        publish_publicservice_budget_status: 'agent:ops'
    }
});

export function allocatePublicServiceResourceBudgets(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceResourceBudgetAllocatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceResourceBudgetAllocator extends BaseManager {}

export const __publicServiceResourceBudgetAllocatorInternals = toolkit.internals;
