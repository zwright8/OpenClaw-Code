import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_risk_aware_scheduler',
    collectionField: 'scheduleItems',
    idField: 'scheduleId',
    defaultName: 'Logistics Schedule Item',
    readyPosture: 'logistics_risk_schedule_ready',
    defaultAgentId: 'agent:logistics-scheduler',
    recommendationTypes: {
        primary: 'schedule_logistics_actions_by_risk',
        guard: 'mitigate_logistics_timing_risk',
        audit: 'audit_logistics_schedule_signals',
        publish: 'publish_logistics_schedule_status'
    },
    recommendationTargetMap: {
        schedule_logistics_actions_by_risk: 'agent:logistics',
        mitigate_logistics_timing_risk: 'agent:risk',
        audit_logistics_schedule_signals: 'agent:trust',
        publish_logistics_schedule_status: 'agent:ops'
    }
});

export function scheduleLogisticsRiskAware(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsRiskAwareSchedulerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsRiskAwareScheduler extends BaseManager {}

export const __logisticsRiskAwareSchedulerInternals = toolkit.internals;
