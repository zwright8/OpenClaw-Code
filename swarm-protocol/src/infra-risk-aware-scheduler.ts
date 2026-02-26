import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_risk_aware_scheduler',
    collectionField: 'scheduleItems',
    idField: 'scheduleId',
    defaultName: 'Infra Schedule Item',
    readyPosture: 'infra_risk_schedule_ready',
    defaultAgentId: 'agent:infra-scheduler',
    recommendationTypes: {
        primary: 'schedule_infra_actions_by_risk',
        guard: 'mitigate_infra_timing_risk',
        audit: 'audit_infra_schedule_signals',
        publish: 'publish_infra_schedule_status'
    },
    recommendationTargetMap: {
        schedule_infra_actions_by_risk: 'agent:infra',
        mitigate_infra_timing_risk: 'agent:risk',
        audit_infra_schedule_signals: 'agent:trust',
        publish_infra_schedule_status: 'agent:ops'
    }
});

export function scheduleInfraRiskAware(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraRiskAwareSchedulerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraRiskAwareScheduler extends BaseManager {}

export const __infraRiskAwareSchedulerInternals = toolkit.internals;
