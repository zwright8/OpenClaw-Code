import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_risk_aware_scheduler',
    collectionField: 'scheduleItems',
    idField: 'scheduleId',
    defaultName: 'Schedule Item',
    readyPosture: 'observability_risk_schedule_ready',
    defaultAgentId: 'agent:observability-scheduler',
    recommendationTypes: {
        primary: 'schedule_observability_actions_by_risk',
        guard: 'mitigate_observability_timing_risk',
        audit: 'audit_observability_schedule_signals',
        publish: 'publish_observability_schedule_status'
    },
    recommendationTargetMap: {
        schedule_observability_actions_by_risk: 'agent:observability',
        mitigate_observability_timing_risk: 'agent:risk',
        audit_observability_schedule_signals: 'agent:trust',
        publish_observability_schedule_status: 'agent:ops'
    }
});

export function scheduleObservabilityRiskAware(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityRiskAwareSchedulerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityRiskAwareScheduler extends BaseManager {}

export const __observabilityRiskAwareSchedulerInternals = toolkit.internals;
