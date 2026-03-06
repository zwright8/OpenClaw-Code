import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_dependency_dag_planner',
    collectionField: 'workflowNodes',
    idField: 'nodeId',
    defaultName: 'Workflow Node',
    readyPosture: 'economic_dependency_dag_ready',
    defaultAgentId: 'agent:economic-dag',
    recommendationTypes: {
        primary: 'plan_economic_dependency_dag',
        guard: 'mitigate_economic_dependency_blockers',
        audit: 'audit_economic_dependency_signals',
        publish: 'publish_economic_dependency_status'
    },
    recommendationTargetMap: {
        plan_economic_dependency_dag: 'agent:economic',
        mitigate_economic_dependency_blockers: 'agent:planning',
        audit_economic_dependency_signals: 'agent:trust',
        publish_economic_dependency_status: 'agent:ops'
    }
});

export function planEconomicDependencyDag(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicDependencyDagPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicDependencyDagPlanner extends BaseManager {}

export const __economicDependencyDagPlannerInternals = toolkit.internals;
