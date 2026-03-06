import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_dependency_dag_planner',
    collectionField: 'workflowNodes',
    idField: 'nodeId',
    defaultName: 'Workflow Node',
    readyPosture: 'comms_dependency_dag_ready',
    defaultAgentId: 'agent:comms-dag',
    recommendationTypes: {
        primary: 'plan_comms_dependency_dag',
        guard: 'mitigate_comms_dependency_blockers',
        audit: 'audit_comms_dependency_signals',
        publish: 'publish_comms_dependency_status'
    },
    recommendationTargetMap: {
        plan_comms_dependency_dag: 'agent:comms',
        mitigate_comms_dependency_blockers: 'agent:planning',
        audit_comms_dependency_signals: 'agent:trust',
        publish_comms_dependency_status: 'agent:ops'
    }
});

export function planCommsDependencyDag(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsDependencyDagPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsDependencyDagPlanner extends BaseManager {}

export const __commsDependencyDagPlannerInternals = toolkit.internals;
