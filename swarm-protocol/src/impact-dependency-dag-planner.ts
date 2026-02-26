import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_dependency_dag_planner',
    collectionField: 'workflowNodes',
    idField: 'nodeId',
    defaultName: 'Workflow Node',
    readyPosture: 'impact_dependency_dag_ready',
    defaultAgentId: 'agent:impact-dag',
    recommendationTypes: {
        primary: 'plan_impact_dependency_dag',
        guard: 'mitigate_impact_dependency_blockers',
        audit: 'audit_impact_dependency_signals',
        publish: 'publish_impact_dependency_status'
    },
    recommendationTargetMap: {
        plan_impact_dependency_dag: 'agent:impact',
        mitigate_impact_dependency_blockers: 'agent:planning',
        audit_impact_dependency_signals: 'agent:trust',
        publish_impact_dependency_status: 'agent:ops'
    }
});

export function planImpactDependencyDag(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactDependencyDagPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactDependencyDagPlanner extends BaseManager {}

export const __impactDependencyDagPlannerInternals = toolkit.internals;
