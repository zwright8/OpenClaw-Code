import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_resource_budget_allocator',
    collectionField: 'budgetItems',
    idField: 'itemId',
    defaultName: 'Budget Item',
    readyPosture: 'economic_budget_allocation_ready',
    defaultAgentId: 'agent:economic-budget',
    recommendationTypes: {
        primary: 'allocate_economic_resource_budget',
        guard: 'mitigate_economic_overcommitment_risk',
        audit: 'audit_economic_budget_signals',
        publish: 'publish_economic_budget_status'
    },
    recommendationTargetMap: {
        allocate_economic_resource_budget: 'agent:economic',
        mitigate_economic_overcommitment_risk: 'agent:finance',
        audit_economic_budget_signals: 'agent:trust',
        publish_economic_budget_status: 'agent:ops'
    }
});

export function allocateEconomicResourceBudgets(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicResourceBudgetAllocatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicResourceBudgetAllocator extends BaseManager {}

export const __economicResourceBudgetAllocatorInternals = toolkit.internals;
