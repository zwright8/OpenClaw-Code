import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_resource_budget_allocator',
    collectionField: 'budgetItems',
    idField: 'itemId',
    defaultName: 'Budget Item',
    readyPosture: 'engineering_budget_allocation_ready',
    defaultAgentId: 'agent:engineering-budget',
    recommendationTypes: {
        primary: 'allocate_engineering_resource_budget',
        guard: 'mitigate_engineering_overcommitment_risk',
        audit: 'audit_engineering_budget_signals',
        publish: 'publish_engineering_budget_status'
    },
    recommendationTargetMap: {
        allocate_engineering_resource_budget: 'agent:engineering',
        mitigate_engineering_overcommitment_risk: 'agent:finance',
        audit_engineering_budget_signals: 'agent:trust',
        publish_engineering_budget_status: 'agent:ops'
    }
});

export function allocateEngineeringResourceBudgets(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringResourceBudgetAllocatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringResourceBudgetAllocator extends BaseManager {}

export const __engineeringResourceBudgetAllocatorInternals = toolkit.internals;
