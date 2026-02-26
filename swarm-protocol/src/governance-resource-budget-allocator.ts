import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_resource_budget_allocator',
    collectionField: 'budgetItems',
    idField: 'itemId',
    defaultName: 'Budget Item',
    readyPosture: 'governance_budget_allocation_ready',
    defaultAgentId: 'agent:governance-budget',
    recommendationTypes: {
        primary: 'allocate_governance_resource_budget',
        guard: 'mitigate_governance_overcommitment_risk',
        audit: 'audit_governance_budget_signals',
        publish: 'publish_governance_budget_status'
    },
    recommendationTargetMap: {
        allocate_governance_resource_budget: 'agent:governance',
        mitigate_governance_overcommitment_risk: 'agent:finance',
        audit_governance_budget_signals: 'agent:trust',
        publish_governance_budget_status: 'agent:ops'
    }
});

export function allocateGovernanceResourceBudgets(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceResourceBudgetAllocatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceResourceBudgetAllocator extends BaseManager {}

export const __governanceResourceBudgetAllocatorInternals = toolkit.internals;
