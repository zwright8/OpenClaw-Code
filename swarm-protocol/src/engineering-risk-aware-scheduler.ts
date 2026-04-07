import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_risk_aware_scheduler',
    collectionField: 'scheduleItems',
    idField: 'scheduleId',
    defaultName: 'Schedule Item',
    readyPosture: 'engineering_risk_schedule_ready',
    defaultAgentId: 'agent:engineering-scheduler',
    recommendationTypes: {
        primary: 'schedule_engineering_actions_by_risk',
        guard: 'mitigate_engineering_timing_risk',
        audit: 'audit_engineering_schedule_signals',
        publish: 'publish_engineering_schedule_status'
    },
    recommendationTargetMap: {
        schedule_engineering_actions_by_risk: 'agent:engineering',
        mitigate_engineering_timing_risk: 'agent:risk',
        audit_engineering_schedule_signals: 'agent:trust',
        publish_engineering_schedule_status: 'agent:ops'
    }
});

export function scheduleEngineeringRiskAware(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringRiskAwareSchedulerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringRiskAwareScheduler extends BaseManager {}

export const __engineeringRiskAwareSchedulerInternals = toolkit.internals;
