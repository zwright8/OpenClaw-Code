import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_dependency_dag_planner',
    collectionField: 'workflowNodes',
    idField: 'nodeId',
    defaultName: 'Workflow Node',
    readyPosture: 'research_dependency_dag_ready',
    defaultAgentId: 'agent:research-dag',
    recommendationTypes: {
        primary: 'plan_research_dependency_dag',
        guard: 'mitigate_research_dependency_blockers',
        audit: 'audit_research_dependency_signals',
        publish: 'publish_research_dependency_status'
    },
    recommendationTargetMap: {
        plan_research_dependency_dag: 'agent:research',
        mitigate_research_dependency_blockers: 'agent:planning',
        audit_research_dependency_signals: 'agent:trust',
        publish_research_dependency_status: 'agent:ops'
    }
});

export function planResearchDependencyDag(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchDependencyDagPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchDependencyDagPlanner extends BaseManager {}

export const __researchDependencyDagPlannerInternals = toolkit.internals;
