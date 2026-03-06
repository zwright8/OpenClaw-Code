import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_dependency_dag_planner',
    collectionField: 'workflowNodes',
    idField: 'nodeId',
    defaultName: 'Oversight Workflow Node',
    readyPosture: 'oversight_dependency_dag_ready',
    defaultAgentId: 'agent:oversight-dag',
    recommendationTypes: {
        primary: 'plan_oversight_dependency_dag',
        guard: 'mitigate_oversight_dependency_blockers',
        audit: 'audit_oversight_dependency_signals',
        publish: 'publish_oversight_dependency_status'
    },
    recommendationTargetMap: {
        plan_oversight_dependency_dag: 'agent:oversight',
        mitigate_oversight_dependency_blockers: 'agent:planning',
        audit_oversight_dependency_signals: 'agent:trust',
        publish_oversight_dependency_status: 'agent:ops'
    }
});

export function planOversightDependencyDag(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightDependencyDagPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightDependencyDagPlanner extends BaseManager {}

export const __oversightDependencyDagPlannerInternals = toolkit.internals;
