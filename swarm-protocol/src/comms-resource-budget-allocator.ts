import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_resource_budget_allocator',
    collectionField: 'budgetItems',
    idField: 'itemId',
    defaultName: 'Budget Item',
    readyPosture: 'comms_budget_allocation_ready',
    defaultAgentId: 'agent:comms-budget',
    recommendationTypes: {
        primary: 'allocate_comms_resource_budget',
        guard: 'mitigate_comms_overcommitment_risk',
        audit: 'audit_comms_budget_signals',
        publish: 'publish_comms_budget_status'
    },
    recommendationTargetMap: {
        allocate_comms_resource_budget: 'agent:comms',
        mitigate_comms_overcommitment_risk: 'agent:finance',
        audit_comms_budget_signals: 'agent:trust',
        publish_comms_budget_status: 'agent:ops'
    }
});

export function allocateCommsResourceBudgets(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsResourceBudgetAllocatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsResourceBudgetAllocator extends BaseManager {}

export const __commsResourceBudgetAllocatorInternals = toolkit.internals;
