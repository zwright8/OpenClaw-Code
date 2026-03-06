import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_resource_budget_allocator',
    collectionField: 'budgetItems',
    idField: 'itemId',
    defaultName: 'Budget Item',
    readyPosture: 'security_budget_allocation_ready',
    defaultAgentId: 'agent:security-budget',
    recommendationTypes: {
        primary: 'allocate_security_resource_budget',
        guard: 'mitigate_security_overcommitment_risk',
        audit: 'audit_security_budget_signals',
        publish: 'publish_security_budget_status'
    },
    recommendationTargetMap: {
        allocate_security_resource_budget: 'agent:security',
        mitigate_security_overcommitment_risk: 'agent:finance',
        audit_security_budget_signals: 'agent:trust',
        publish_security_budget_status: 'agent:ops'
    }
});

export function allocateSecurityResourceBudgets(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityResourceBudgetAllocatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityResourceBudgetAllocator extends BaseManager {}

export const __securityResourceBudgetAllocatorInternals = toolkit.internals;
