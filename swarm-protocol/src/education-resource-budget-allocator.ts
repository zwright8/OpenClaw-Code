import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_resource_budget_allocator',
    collectionField: 'budgetItems',
    idField: 'itemId',
    defaultName: 'Budget Item',
    readyPosture: 'education_budget_allocation_ready',
    defaultAgentId: 'agent:education-budget',
    recommendationTypes: {
        primary: 'allocate_education_resource_budget',
        guard: 'mitigate_education_overcommitment_risk',
        audit: 'audit_education_budget_signals',
        publish: 'publish_education_budget_status'
    },
    recommendationTargetMap: {
        allocate_education_resource_budget: 'agent:education',
        mitigate_education_overcommitment_risk: 'agent:finance',
        audit_education_budget_signals: 'agent:trust',
        publish_education_budget_status: 'agent:ops'
    }
});

export function allocateEducationResourceBudgets(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationResourceBudgetAllocatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationResourceBudgetAllocator extends BaseManager {}

export const __educationResourceBudgetAllocatorInternals = toolkit.internals;
