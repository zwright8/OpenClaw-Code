import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_dependency_dag_planner',
    collectionField: 'workflowNodes',
    idField: 'nodeId',
    defaultName: 'Evolution Workflow Node',
    readyPosture: 'evolution_dependency_dag_ready',
    defaultAgentId: 'agent:evolution-dag',
    recommendationTypes: {
        primary: 'plan_evolution_dependency_dag',
        guard: 'mitigate_evolution_dependency_cycles',
        audit: 'audit_evolution_dependency_signals',
        publish: 'publish_evolution_dependency_dag_status'
    },
    recommendationTargetMap: {
        plan_evolution_dependency_dag: 'agent:evolution',
        mitigate_evolution_dependency_cycles: 'agent:operations',
        audit_evolution_dependency_signals: 'agent:trust',
        publish_evolution_dependency_dag_status: 'agent:ops'
    }
});

export function planEvolutionDependencyDag(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionDependencyDagPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionDependencyDagPlanner extends BaseManager {}

export const __evolutionDependencyDagPlannerInternals = toolkit.internals;
