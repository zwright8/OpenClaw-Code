import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_resource_budget_allocator',
    collectionField: 'budgetItems',
    idField: 'itemId',
    defaultName: 'Budget Item',
    readyPosture: 'observability_budget_allocation_ready',
    defaultAgentId: 'agent:observability-budget',
    recommendationTypes: {
        primary: 'allocate_observability_resource_budget',
        guard: 'mitigate_observability_overcommitment_risk',
        audit: 'audit_observability_budget_signals',
        publish: 'publish_observability_budget_status'
    },
    recommendationTargetMap: {
        allocate_observability_resource_budget: 'agent:observability',
        mitigate_observability_overcommitment_risk: 'agent:finance',
        audit_observability_budget_signals: 'agent:trust',
        publish_observability_budget_status: 'agent:ops'
    }
});

export function allocateObservabilityResourceBudgets(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityResourceBudgetAllocatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityResourceBudgetAllocator extends BaseManager {}

export const __observabilityResourceBudgetAllocatorInternals = toolkit.internals;
