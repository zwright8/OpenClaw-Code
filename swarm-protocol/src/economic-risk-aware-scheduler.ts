import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_risk_aware_scheduler',
    collectionField: 'scheduleItems',
    idField: 'scheduleId',
    defaultName: 'Schedule Item',
    readyPosture: 'economic_risk_schedule_ready',
    defaultAgentId: 'agent:economic-scheduler',
    recommendationTypes: {
        primary: 'schedule_economic_actions_by_risk',
        guard: 'mitigate_economic_timing_risk',
        audit: 'audit_economic_schedule_signals',
        publish: 'publish_economic_schedule_status'
    },
    recommendationTargetMap: {
        schedule_economic_actions_by_risk: 'agent:economic',
        mitigate_economic_timing_risk: 'agent:risk',
        audit_economic_schedule_signals: 'agent:trust',
        publish_economic_schedule_status: 'agent:ops'
    }
});

export function scheduleEconomicRiskAware(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicRiskAwareSchedulerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicRiskAwareScheduler extends BaseManager {}

export const __economicRiskAwareSchedulerInternals = toolkit.internals;
