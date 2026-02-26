import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_dependency_dag_planner',
    collectionField: 'workflowNodes',
    idField: 'nodeId',
    defaultName: 'Logistics Workflow Node',
    readyPosture: 'logistics_dependency_dag_ready',
    defaultAgentId: 'agent:logistics-dag',
    recommendationTypes: {
        primary: 'plan_logistics_dependency_dag',
        guard: 'mitigate_logistics_dependency_blockers',
        audit: 'audit_logistics_dependency_signals',
        publish: 'publish_logistics_dependency_status'
    },
    recommendationTargetMap: {
        plan_logistics_dependency_dag: 'agent:logistics',
        mitigate_logistics_dependency_blockers: 'agent:planning',
        audit_logistics_dependency_signals: 'agent:trust',
        publish_logistics_dependency_status: 'agent:ops'
    }
});

export function planLogisticsDependencyDag(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsDependencyDagPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsDependencyDagPlanner extends BaseManager {}

export const __logisticsDependencyDagPlannerInternals = toolkit.internals;
