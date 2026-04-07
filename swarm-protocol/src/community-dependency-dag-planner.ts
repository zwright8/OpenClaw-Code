import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_dependency_dag_planner',
    collectionField: 'workflowNodes',
    idField: 'nodeId',
    defaultName: 'Community Workflow Node',
    readyPosture: 'community_dependency_dag_ready',
    defaultAgentId: 'agent:community-dag',
    recommendationTypes: {
        primary: 'plan_community_dependency_dag',
        guard: 'mitigate_community_dependency_cycles',
        audit: 'audit_community_dependency_signals',
        publish: 'publish_community_dependency_dag_status'
    },
    recommendationTargetMap: {
        plan_community_dependency_dag: 'agent:community',
        mitigate_community_dependency_cycles: 'agent:operations',
        audit_community_dependency_signals: 'agent:trust',
        publish_community_dependency_dag_status: 'agent:ops'
    }
});

export function planCommunityDependencyDag(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityDependencyDagPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityDependencyDagPlanner extends BaseManager {}

export const __communityDependencyDagPlannerInternals = toolkit.internals;
