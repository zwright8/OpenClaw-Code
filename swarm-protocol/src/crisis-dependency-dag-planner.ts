import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_dependency_dag_planner',
    collectionField: 'workflowNodes',
    idField: 'nodeId',
    defaultName: 'Workflow Node',
    readyPosture: 'crisis_dependency_dag_ready',
    defaultAgentId: 'agent:crisis-dag',
    recommendationTypes: {
        primary: 'plan_crisis_dependency_dag',
        guard: 'mitigate_crisis_dependency_blockers',
        audit: 'audit_crisis_dependency_signals',
        publish: 'publish_crisis_dependency_status'
    },
    recommendationTargetMap: {
        plan_crisis_dependency_dag: 'agent:crisis',
        mitigate_crisis_dependency_blockers: 'agent:planning',
        audit_crisis_dependency_signals: 'agent:trust',
        publish_crisis_dependency_status: 'agent:ops'
    }
});

export function planCrisisDependencyDag(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisDependencyDagPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisDependencyDagPlanner extends BaseManager {}

export const __crisisDependencyDagPlannerInternals = toolkit.internals;
