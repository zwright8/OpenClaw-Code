import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_dependency_dag_planner',
    collectionField: 'workflowNodes',
    idField: 'nodeId',
    defaultName: 'Inclusion Workflow Node',
    readyPosture: 'inclusion_dependency_dag_ready',
    defaultAgentId: 'agent:inclusion-dag',
    recommendationTypes: {
        primary: 'plan_inclusion_dependency_dag',
        guard: 'mitigate_inclusion_dependency_cycles',
        audit: 'audit_inclusion_dependency_signals',
        publish: 'publish_inclusion_dependency_dag_status'
    },
    recommendationTargetMap: {
        plan_inclusion_dependency_dag: 'agent:inclusion',
        mitigate_inclusion_dependency_cycles: 'agent:operations',
        audit_inclusion_dependency_signals: 'agent:trust',
        publish_inclusion_dependency_dag_status: 'agent:ops'
    }
});

export function planInclusionDependencyDag(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionDependencyDagPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionDependencyDagPlanner extends BaseManager {}

export const __inclusionDependencyDagPlannerInternals = toolkit.internals;
