import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_resource_budget_allocator',
    collectionField: 'budgetItems',
    idField: 'itemId',
    defaultName: 'Budget Item',
    readyPosture: 'research_budget_allocation_ready',
    defaultAgentId: 'agent:research-budget',
    recommendationTypes: {
        primary: 'allocate_research_resource_budget',
        guard: 'mitigate_research_overcommitment_risk',
        audit: 'audit_research_budget_signals',
        publish: 'publish_research_budget_status'
    },
    recommendationTargetMap: {
        allocate_research_resource_budget: 'agent:research',
        mitigate_research_overcommitment_risk: 'agent:finance',
        audit_research_budget_signals: 'agent:trust',
        publish_research_budget_status: 'agent:ops'
    }
});

export function allocateResearchResourceBudgets(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchResourceBudgetAllocatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchResourceBudgetAllocator extends BaseManager {}

export const __researchResourceBudgetAllocatorInternals = toolkit.internals;
