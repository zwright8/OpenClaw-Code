import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_resource_budget_allocator',
    collectionField: 'budgetItems',
    idField: 'itemId',
    defaultName: 'Rights Budget Item',
    readyPosture: 'rights_budget_balanced',
    defaultAgentId: 'agent:rights-budget',
    recommendationTypes: {
        primary: 'allocate_rights_resource_budgets',
        guard: 'mitigate_rights_budget_overcommitment',
        audit: 'audit_rights_budget_signals',
        publish: 'publish_rights_budget_status'
    },
    recommendationTargetMap: {
        allocate_rights_resource_budgets: 'agent:rights',
        mitigate_rights_budget_overcommitment: 'agent:finance',
        audit_rights_budget_signals: 'agent:trust',
        publish_rights_budget_status: 'agent:ops'
    }
});

export function allocateRightsResourceBudgets(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsResourceBudgetAllocatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsResourceBudgetAllocator extends BaseManager {}

export const __rightsResourceBudgetAllocatorInternals = toolkit.internals;
