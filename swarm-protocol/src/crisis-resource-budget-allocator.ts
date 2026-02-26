import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_resource_budget_allocator',
    collectionField: 'budgetItems',
    idField: 'itemId',
    defaultName: 'Budget Item',
    readyPosture: 'crisis_budget_allocation_ready',
    defaultAgentId: 'agent:crisis-budget',
    recommendationTypes: {
        primary: 'allocate_crisis_resource_budget',
        guard: 'mitigate_crisis_overcommitment_risk',
        audit: 'audit_crisis_budget_signals',
        publish: 'publish_crisis_budget_status'
    },
    recommendationTargetMap: {
        allocate_crisis_resource_budget: 'agent:crisis',
        mitigate_crisis_overcommitment_risk: 'agent:finance',
        audit_crisis_budget_signals: 'agent:trust',
        publish_crisis_budget_status: 'agent:ops'
    }
});

export function allocateCrisisResourceBudgets(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisResourceBudgetAllocatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisResourceBudgetAllocator extends BaseManager {}

export const __crisisResourceBudgetAllocatorInternals = toolkit.internals;
