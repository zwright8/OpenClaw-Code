import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_dependency_dag_planner',
    collectionField: 'workflowNodes',
    idField: 'nodeId',
    defaultName: 'Workflow Node',
    readyPosture: 'observability_dependency_dag_ready',
    defaultAgentId: 'agent:observability-dag',
    recommendationTypes: {
        primary: 'plan_observability_dependency_dag',
        guard: 'mitigate_observability_dependency_blockers',
        audit: 'audit_observability_dependency_signals',
        publish: 'publish_observability_dependency_status'
    },
    recommendationTargetMap: {
        plan_observability_dependency_dag: 'agent:observability',
        mitigate_observability_dependency_blockers: 'agent:planning',
        audit_observability_dependency_signals: 'agent:trust',
        publish_observability_dependency_status: 'agent:ops'
    }
});

export function planObservabilityDependencyDag(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityDependencyDagPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityDependencyDagPlanner extends BaseManager {}

export const __observabilityDependencyDagPlannerInternals = toolkit.internals;
