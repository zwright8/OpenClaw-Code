import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_dependency_dag_planner',
    collectionField: 'workflowNodes',
    idField: 'nodeId',
    defaultName: 'Rights Workflow Node',
    readyPosture: 'rights_dependency_dag_ready',
    defaultAgentId: 'agent:rights-dag',
    recommendationTypes: {
        primary: 'plan_rights_dependency_dag',
        guard: 'mitigate_rights_dependency_cycles',
        audit: 'audit_rights_dependency_signals',
        publish: 'publish_rights_dependency_dag_status'
    },
    recommendationTargetMap: {
        plan_rights_dependency_dag: 'agent:rights',
        mitigate_rights_dependency_cycles: 'agent:operations',
        audit_rights_dependency_signals: 'agent:trust',
        publish_rights_dependency_dag_status: 'agent:ops'
    }
});

export function planRightsDependencyDag(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsDependencyDagPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsDependencyDagPlanner extends BaseManager {}

export const __rightsDependencyDagPlannerInternals = toolkit.internals;
