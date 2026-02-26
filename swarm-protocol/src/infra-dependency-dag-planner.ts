import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_dependency_dag_planner',
    collectionField: 'workflowNodes',
    idField: 'nodeId',
    defaultName: 'Infra Workflow Node',
    readyPosture: 'infra_dependency_dag_ready',
    defaultAgentId: 'agent:infra-dag',
    recommendationTypes: {
        primary: 'plan_infra_dependency_dag',
        guard: 'mitigate_infra_dependency_cycles',
        audit: 'audit_infra_dependency_signals',
        publish: 'publish_infra_dependency_dag_status'
    },
    recommendationTargetMap: {
        plan_infra_dependency_dag: 'agent:infra',
        mitigate_infra_dependency_cycles: 'agent:operations',
        audit_infra_dependency_signals: 'agent:trust',
        publish_infra_dependency_dag_status: 'agent:ops'
    }
});

export function planInfraDependencyDag(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraDependencyDagPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraDependencyDagPlanner extends BaseManager {}

export const __infraDependencyDagPlannerInternals = toolkit.internals;
