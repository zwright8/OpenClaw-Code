import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_dependency_dag_planner',
    collectionField: 'workflowNodes',
    idField: 'nodeId',
    defaultName: 'Workflow Node',
    readyPosture: 'governance_dependency_dag_ready',
    defaultAgentId: 'agent:governance-dag',
    recommendationTypes: {
        primary: 'plan_governance_dependency_dag',
        guard: 'mitigate_governance_dependency_blockers',
        audit: 'audit_governance_dependency_signals',
        publish: 'publish_governance_dependency_status'
    },
    recommendationTargetMap: {
        plan_governance_dependency_dag: 'agent:governance',
        mitigate_governance_dependency_blockers: 'agent:planning',
        audit_governance_dependency_signals: 'agent:trust',
        publish_governance_dependency_status: 'agent:ops'
    }
});

export function planGovernanceDependencyDag(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceDependencyDagPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceDependencyDagPlanner extends BaseManager {}

export const __governanceDependencyDagPlannerInternals = toolkit.internals;
