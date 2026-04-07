import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_resource_budget_allocator',
    collectionField: 'budgetItems',
    idField: 'itemId',
    defaultName: 'Cultural Budget Item',
    readyPosture: 'cultural_budget_balanced',
    defaultAgentId: 'agent:cultural-budget',
    recommendationTypes: {
        primary: 'allocate_cultural_resource_budgets',
        guard: 'mitigate_cultural_budget_overcommitment',
        audit: 'audit_cultural_budget_signals',
        publish: 'publish_cultural_budget_status'
    },
    recommendationTargetMap: {
        allocate_cultural_resource_budgets: 'agent:cultural',
        mitigate_cultural_budget_overcommitment: 'agent:finance',
        audit_cultural_budget_signals: 'agent:trust',
        publish_cultural_budget_status: 'agent:ops'
    }
});

export function allocateCulturalResourceBudgets(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalResourceBudgetAllocatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalResourceBudgetAllocator extends BaseManager {}

export const __culturalResourceBudgetAllocatorInternals = toolkit.internals;
