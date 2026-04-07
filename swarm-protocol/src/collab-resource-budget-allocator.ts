import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_resource_budget_allocator',
    collectionField: 'budgetItems',
    idField: 'itemId',
    defaultName: 'Collab Budget Item',
    readyPosture: 'collab_budget_allocation_ready',
    defaultAgentId: 'agent:collab-budget',
    recommendationTypes: {
        primary: 'allocate_collab_resource_budget',
        guard: 'mitigate_collab_overcommitment_risk',
        audit: 'audit_collab_budget_signals',
        publish: 'publish_collab_budget_status'
    },
    recommendationTargetMap: {
        allocate_collab_resource_budget: 'agent:collab',
        mitigate_collab_overcommitment_risk: 'agent:finance',
        audit_collab_budget_signals: 'agent:trust',
        publish_collab_budget_status: 'agent:ops'
    }
});

export function allocateCollabResourceBudgets(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabResourceBudgetAllocatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabResourceBudgetAllocator extends BaseManager {}

export const __collabResourceBudgetAllocatorInternals = toolkit.internals;
