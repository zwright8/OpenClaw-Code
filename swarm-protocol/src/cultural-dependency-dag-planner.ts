import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_dependency_dag_planner',
    collectionField: 'workflowNodes',
    idField: 'nodeId',
    defaultName: 'Cultural Workflow Node',
    readyPosture: 'cultural_dependency_dag_ready',
    defaultAgentId: 'agent:cultural-dag',
    recommendationTypes: {
        primary: 'plan_cultural_dependency_dag',
        guard: 'mitigate_cultural_dependency_cycles',
        audit: 'audit_cultural_dependency_signals',
        publish: 'publish_cultural_dependency_dag_status'
    },
    recommendationTargetMap: {
        plan_cultural_dependency_dag: 'agent:cultural',
        mitigate_cultural_dependency_cycles: 'agent:operations',
        audit_cultural_dependency_signals: 'agent:trust',
        publish_cultural_dependency_dag_status: 'agent:ops'
    }
});

export function planCulturalDependencyDag(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalDependencyDagPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalDependencyDagPlanner extends BaseManager {}

export const __culturalDependencyDagPlannerInternals = toolkit.internals;
