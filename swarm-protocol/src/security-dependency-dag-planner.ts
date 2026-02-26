import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_dependency_dag_planner',
    collectionField: 'workflowNodes',
    idField: 'nodeId',
    defaultName: 'Workflow Node',
    readyPosture: 'security_dependency_dag_ready',
    defaultAgentId: 'agent:security-dag',
    recommendationTypes: {
        primary: 'plan_security_dependency_dag',
        guard: 'mitigate_security_dependency_blockers',
        audit: 'audit_security_dependency_signals',
        publish: 'publish_security_dependency_status'
    },
    recommendationTargetMap: {
        plan_security_dependency_dag: 'agent:security',
        mitigate_security_dependency_blockers: 'agent:planning',
        audit_security_dependency_signals: 'agent:trust',
        publish_security_dependency_status: 'agent:ops'
    }
});

export function planSecurityDependencyDag(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityDependencyDagPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityDependencyDagPlanner extends BaseManager {}

export const __securityDependencyDagPlannerInternals = toolkit.internals;
