import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_resource_budget_allocator',
    collectionField: 'budgetItems',
    idField: 'itemId',
    defaultName: 'Infra Budget Item',
    readyPosture: 'infra_budget_balanced',
    defaultAgentId: 'agent:infra-budget',
    recommendationTypes: {
        primary: 'allocate_infra_resource_budgets',
        guard: 'mitigate_infra_budget_overcommitment',
        audit: 'audit_infra_budget_signals',
        publish: 'publish_infra_budget_status'
    },
    recommendationTargetMap: {
        allocate_infra_resource_budgets: 'agent:infra',
        mitigate_infra_budget_overcommitment: 'agent:finance',
        audit_infra_budget_signals: 'agent:trust',
        publish_infra_budget_status: 'agent:ops'
    }
});

export function allocateInfraResourceBudgets(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraResourceBudgetAllocatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraResourceBudgetAllocator extends BaseManager {}

export const __infraResourceBudgetAllocatorInternals = toolkit.internals;
