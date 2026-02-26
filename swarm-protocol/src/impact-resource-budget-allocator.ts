import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_resource_budget_allocator',
    collectionField: 'budgetItems',
    idField: 'itemId',
    defaultName: 'Budget Item',
    readyPosture: 'impact_budget_allocation_ready',
    defaultAgentId: 'agent:impact-budget',
    recommendationTypes: {
        primary: 'allocate_impact_resource_budget',
        guard: 'mitigate_impact_overcommitment_risk',
        audit: 'audit_impact_budget_signals',
        publish: 'publish_impact_budget_status'
    },
    recommendationTargetMap: {
        allocate_impact_resource_budget: 'agent:impact',
        mitigate_impact_overcommitment_risk: 'agent:finance',
        audit_impact_budget_signals: 'agent:trust',
        publish_impact_budget_status: 'agent:ops'
    }
});

export function allocateImpactResourceBudgets(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactResourceBudgetAllocatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactResourceBudgetAllocator extends BaseManager {}

export const __impactResourceBudgetAllocatorInternals = toolkit.internals;
