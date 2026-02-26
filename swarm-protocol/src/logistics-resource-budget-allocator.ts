import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_resource_budget_allocator',
    collectionField: 'budgetItems',
    idField: 'itemId',
    defaultName: 'Logistics Budget Item',
    readyPosture: 'logistics_budget_allocation_ready',
    defaultAgentId: 'agent:logistics-budget',
    recommendationTypes: {
        primary: 'allocate_logistics_resource_budget',
        guard: 'mitigate_logistics_overcommitment_risk',
        audit: 'audit_logistics_budget_signals',
        publish: 'publish_logistics_budget_status'
    },
    recommendationTargetMap: {
        allocate_logistics_resource_budget: 'agent:logistics',
        mitigate_logistics_overcommitment_risk: 'agent:finance',
        audit_logistics_budget_signals: 'agent:trust',
        publish_logistics_budget_status: 'agent:ops'
    }
});

export function allocateLogisticsResourceBudgets(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsResourceBudgetAllocatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsResourceBudgetAllocator extends BaseManager {}

export const __logisticsResourceBudgetAllocatorInternals = toolkit.internals;
