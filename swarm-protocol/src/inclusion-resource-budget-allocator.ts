import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_resource_budget_allocator',
    collectionField: 'budgetItems',
    idField: 'itemId',
    defaultName: 'Inclusion Budget Item',
    readyPosture: 'inclusion_budget_balanced',
    defaultAgentId: 'agent:inclusion-budget',
    recommendationTypes: {
        primary: 'allocate_inclusion_resource_budgets',
        guard: 'mitigate_inclusion_budget_overcommitment',
        audit: 'audit_inclusion_budget_signals',
        publish: 'publish_inclusion_budget_status'
    },
    recommendationTargetMap: {
        allocate_inclusion_resource_budgets: 'agent:inclusion',
        mitigate_inclusion_budget_overcommitment: 'agent:finance',
        audit_inclusion_budget_signals: 'agent:trust',
        publish_inclusion_budget_status: 'agent:ops'
    }
});

export function allocateInclusionResourceBudgets(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionResourceBudgetAllocatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionResourceBudgetAllocator extends BaseManager {}

export const __inclusionResourceBudgetAllocatorInternals = toolkit.internals;
