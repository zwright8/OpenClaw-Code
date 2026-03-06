import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_continuous_improvement_planner',
    collectionField: 'improvements',
    idField: 'improvementId',
    defaultName: 'Security Improvement',
    readyPosture: 'security_continuous_improvement_ready',
    defaultAgentId: 'agent:security-continuous-improvement',
    recommendationTypes: {
        primary: 'plan_security_continuous_improvement',
        guard: 'mitigate_security_improvement_stagnation',
        audit: 'audit_security_continuous_improvement_signals',
        publish: 'publish_security_continuous_improvement_status'
    },
    recommendationTargetMap: {
        plan_security_continuous_improvement: 'agent:operations',
        mitigate_security_improvement_stagnation: 'agent:quality',
        audit_security_continuous_improvement_signals: 'agent:trust',
        publish_security_continuous_improvement_status: 'agent:ops'
    }
});

export function planSecurityContinuousImprovement(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityContinuousImprovementPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityContinuousImprovementPlanner extends BaseManager {}

export const __securityContinuousImprovementPlannerInternals = toolkit.internals;
