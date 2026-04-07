import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_risk_aware_scheduler',
    collectionField: 'scheduleItems',
    idField: 'scheduleId',
    defaultName: 'Schedule Item',
    readyPosture: 'security_risk_schedule_ready',
    defaultAgentId: 'agent:security-scheduler',
    recommendationTypes: {
        primary: 'schedule_security_actions_by_risk',
        guard: 'mitigate_security_timing_risk',
        audit: 'audit_security_schedule_signals',
        publish: 'publish_security_schedule_status'
    },
    recommendationTargetMap: {
        schedule_security_actions_by_risk: 'agent:security',
        mitigate_security_timing_risk: 'agent:risk',
        audit_security_schedule_signals: 'agent:trust',
        publish_security_schedule_status: 'agent:ops'
    }
});

export function scheduleSecurityRiskAware(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityRiskAwareSchedulerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityRiskAwareScheduler extends BaseManager {}

export const __securityRiskAwareSchedulerInternals = toolkit.internals;
