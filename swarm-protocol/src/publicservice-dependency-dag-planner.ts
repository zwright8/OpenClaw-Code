import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_dependency_dag_planner',
    collectionField: 'workflowNodes',
    idField: 'nodeId',
    defaultName: 'PublicService Workflow Node',
    readyPosture: 'publicservice_dependency_dag_ready',
    defaultAgentId: 'agent:publicservice-dag',
    recommendationTypes: {
        primary: 'plan_publicservice_dependency_dag',
        guard: 'mitigate_publicservice_dependency_blockers',
        audit: 'audit_publicservice_dependency_signals',
        publish: 'publish_publicservice_dependency_status'
    },
    recommendationTargetMap: {
        plan_publicservice_dependency_dag: 'agent:publicservice',
        mitigate_publicservice_dependency_blockers: 'agent:planning',
        audit_publicservice_dependency_signals: 'agent:trust',
        publish_publicservice_dependency_status: 'agent:ops'
    }
});

export function planPublicServiceDependencyDag(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceDependencyDagPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceDependencyDagPlanner extends BaseManager {}

export const __publicServiceDependencyDagPlannerInternals = toolkit.internals;
