import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_resource_budget_allocator',
    collectionField: 'budgetItems',
    idField: 'itemId',
    defaultName: 'Oversight Budget Item',
    readyPosture: 'oversight_budget_allocation_ready',
    defaultAgentId: 'agent:oversight-budget',
    recommendationTypes: {
        primary: 'allocate_oversight_resource_budget',
        guard: 'mitigate_oversight_overcommitment_risk',
        audit: 'audit_oversight_budget_signals',
        publish: 'publish_oversight_budget_status'
    },
    recommendationTargetMap: {
        allocate_oversight_resource_budget: 'agent:oversight',
        mitigate_oversight_overcommitment_risk: 'agent:finance',
        audit_oversight_budget_signals: 'agent:trust',
        publish_oversight_budget_status: 'agent:ops'
    }
});

export function allocateOversightResourceBudgets(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightResourceBudgetAllocatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightResourceBudgetAllocator extends BaseManager {}

export const __oversightResourceBudgetAllocatorInternals = toolkit.internals;
