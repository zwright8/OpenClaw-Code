import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_resource_budget_allocator',
    collectionField: 'budgetItems',
    idField: 'itemId',
    defaultName: 'Evolution Budget Item',
    readyPosture: 'evolution_budget_balanced',
    defaultAgentId: 'agent:evolution-budget',
    recommendationTypes: {
        primary: 'allocate_evolution_resource_budgets',
        guard: 'mitigate_evolution_budget_overcommitment',
        audit: 'audit_evolution_budget_signals',
        publish: 'publish_evolution_budget_status'
    },
    recommendationTargetMap: {
        allocate_evolution_resource_budgets: 'agent:evolution',
        mitigate_evolution_budget_overcommitment: 'agent:finance',
        audit_evolution_budget_signals: 'agent:trust',
        publish_evolution_budget_status: 'agent:ops'
    }
});

export function allocateEvolutionResourceBudgets(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionResourceBudgetAllocatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionResourceBudgetAllocator extends BaseManager {}

export const __evolutionResourceBudgetAllocatorInternals = toolkit.internals;
