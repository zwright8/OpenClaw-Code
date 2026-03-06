import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_resource_budget_allocator',
    collectionField: 'budgetItems',
    idField: 'itemId',
    defaultName: 'Budget Item',
    readyPosture: 'federation_budget_allocation_ready',
    defaultAgentId: 'agent:federation-budget',
    recommendationTypes: {
        primary: 'allocate_federation_resource_budget',
        guard: 'mitigate_federation_overcommitment_risk',
        audit: 'audit_federation_budget_signals',
        publish: 'publish_federation_budget_status'
    },
    recommendationTargetMap: {
        allocate_federation_resource_budget: 'agent:federation',
        mitigate_federation_overcommitment_risk: 'agent:finance',
        audit_federation_budget_signals: 'agent:trust',
        publish_federation_budget_status: 'agent:ops'
    }
});

export function allocateFederationResourceBudgets(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationResourceBudgetAllocatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationResourceBudgetAllocator extends BaseManager {}

export const __federationResourceBudgetAllocatorInternals = toolkit.internals;
