import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_risk_aware_scheduler',
    collectionField: 'scheduleItems',
    idField: 'scheduleId',
    defaultName: 'Oversight Schedule Item',
    readyPosture: 'oversight_risk_schedule_ready',
    defaultAgentId: 'agent:oversight-scheduler',
    recommendationTypes: {
        primary: 'schedule_oversight_actions_by_risk',
        guard: 'mitigate_oversight_timing_risk',
        audit: 'audit_oversight_schedule_signals',
        publish: 'publish_oversight_schedule_status'
    },
    recommendationTargetMap: {
        schedule_oversight_actions_by_risk: 'agent:oversight',
        mitigate_oversight_timing_risk: 'agent:risk',
        audit_oversight_schedule_signals: 'agent:trust',
        publish_oversight_schedule_status: 'agent:ops'
    }
});

export function scheduleOversightRiskAware(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightRiskAwareSchedulerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightRiskAwareScheduler extends BaseManager {}

export const __oversightRiskAwareSchedulerInternals = toolkit.internals;
