import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_dependency_dag_planner',
    collectionField: 'workflowNodes',
    idField: 'nodeId',
    defaultName: 'Collab Workflow Node',
    readyPosture: 'collab_dependency_dag_ready',
    defaultAgentId: 'agent:collab-dag',
    recommendationTypes: {
        primary: 'plan_collab_dependency_dag',
        guard: 'mitigate_collab_dependency_blockers',
        audit: 'audit_collab_dependency_signals',
        publish: 'publish_collab_dependency_status'
    },
    recommendationTargetMap: {
        plan_collab_dependency_dag: 'agent:collab',
        mitigate_collab_dependency_blockers: 'agent:planning',
        audit_collab_dependency_signals: 'agent:trust',
        publish_collab_dependency_status: 'agent:ops'
    }
});

export function planCollabDependencyDag(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabDependencyDagPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabDependencyDagPlanner extends BaseManager {}

export const __collabDependencyDagPlannerInternals = toolkit.internals;
