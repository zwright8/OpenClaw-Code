import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_dependency_dag_planner',
    collectionField: 'workflowNodes',
    idField: 'nodeId',
    defaultName: 'Workflow Node',
    readyPosture: 'federation_dependency_dag_ready',
    defaultAgentId: 'agent:federation-dag',
    recommendationTypes: {
        primary: 'plan_federation_dependency_dag',
        guard: 'mitigate_federation_dependency_blockers',
        audit: 'audit_federation_dependency_signals',
        publish: 'publish_federation_dependency_status'
    },
    recommendationTargetMap: {
        plan_federation_dependency_dag: 'agent:federation',
        mitigate_federation_dependency_blockers: 'agent:planning',
        audit_federation_dependency_signals: 'agent:trust',
        publish_federation_dependency_status: 'agent:ops'
    }
});

export function planFederationDependencyDag(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationDependencyDagPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationDependencyDagPlanner extends BaseManager {}

export const __federationDependencyDagPlannerInternals = toolkit.internals;
