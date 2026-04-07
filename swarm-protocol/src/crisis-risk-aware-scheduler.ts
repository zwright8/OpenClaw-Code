import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_risk_aware_scheduler',
    collectionField: 'scheduleItems',
    idField: 'scheduleId',
    defaultName: 'Schedule Item',
    readyPosture: 'crisis_risk_schedule_ready',
    defaultAgentId: 'agent:crisis-scheduler',
    recommendationTypes: {
        primary: 'schedule_crisis_actions_by_risk',
        guard: 'mitigate_crisis_timing_risk',
        audit: 'audit_crisis_schedule_signals',
        publish: 'publish_crisis_schedule_status'
    },
    recommendationTargetMap: {
        schedule_crisis_actions_by_risk: 'agent:crisis',
        mitigate_crisis_timing_risk: 'agent:risk',
        audit_crisis_schedule_signals: 'agent:trust',
        publish_crisis_schedule_status: 'agent:ops'
    }
});

export function scheduleCrisisRiskAware(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisRiskAwareSchedulerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisRiskAwareScheduler extends BaseManager {}

export const __crisisRiskAwareSchedulerInternals = toolkit.internals;
