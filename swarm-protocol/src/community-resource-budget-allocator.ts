import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_resource_budget_allocator',
    collectionField: 'budgetItems',
    idField: 'itemId',
    defaultName: 'Community Budget Item',
    readyPosture: 'community_budget_balanced',
    defaultAgentId: 'agent:community-budget',
    recommendationTypes: {
        primary: 'allocate_community_resource_budgets',
        guard: 'mitigate_community_budget_overcommitment',
        audit: 'audit_community_budget_signals',
        publish: 'publish_community_budget_status'
    },
    recommendationTargetMap: {
        allocate_community_resource_budgets: 'agent:community',
        mitigate_community_budget_overcommitment: 'agent:finance',
        audit_community_budget_signals: 'agent:trust',
        publish_community_budget_status: 'agent:ops'
    }
});

export function allocateCommunityResourceBudgets(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityResourceBudgetAllocatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityResourceBudgetAllocator extends BaseManager {}

export const __communityResourceBudgetAllocatorInternals = toolkit.internals;
