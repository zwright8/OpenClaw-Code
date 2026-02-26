import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_dependency_dag_planner',
    collectionField: 'workflowNodes',
    idField: 'nodeId',
    defaultName: 'Workflow Node',
    readyPosture: 'education_dependency_dag_ready',
    defaultAgentId: 'agent:education-dag',
    recommendationTypes: {
        primary: 'plan_education_dependency_dag',
        guard: 'mitigate_education_dependency_blockers',
        audit: 'audit_education_dependency_signals',
        publish: 'publish_education_dependency_status'
    },
    recommendationTargetMap: {
        plan_education_dependency_dag: 'agent:education',
        mitigate_education_dependency_blockers: 'agent:planning',
        audit_education_dependency_signals: 'agent:trust',
        publish_education_dependency_status: 'agent:ops'
    }
});

export function planEducationDependencyDag(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationDependencyDagPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationDependencyDagPlanner extends BaseManager {}

export const __educationDependencyDagPlannerInternals = toolkit.internals;
