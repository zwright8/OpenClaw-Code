import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_dependency_dag_planner',
    collectionField: 'workflowNodes',
    idField: 'nodeId',
    defaultName: 'Workflow Node',
    readyPosture: 'engineering_dependency_dag_ready',
    defaultAgentId: 'agent:engineering-dag',
    recommendationTypes: {
        primary: 'plan_engineering_dependency_dag',
        guard: 'mitigate_engineering_dependency_blockers',
        audit: 'audit_engineering_dependency_signals',
        publish: 'publish_engineering_dependency_status'
    },
    recommendationTargetMap: {
        plan_engineering_dependency_dag: 'agent:engineering',
        mitigate_engineering_dependency_blockers: 'agent:planning',
        audit_engineering_dependency_signals: 'agent:trust',
        publish_engineering_dependency_status: 'agent:ops'
    }
});

export function planEngineeringDependencyDag(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringDependencyDagPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringDependencyDagPlanner extends BaseManager {}

export const __engineeringDependencyDagPlannerInternals = toolkit.internals;
