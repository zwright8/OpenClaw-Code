import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_risk_aware_scheduler',
    collectionField: 'scheduleItems',
    idField: 'scheduleId',
    defaultName: 'Schedule Item',
    readyPosture: 'comms_risk_schedule_ready',
    defaultAgentId: 'agent:comms-scheduler',
    recommendationTypes: {
        primary: 'schedule_comms_actions_by_risk',
        guard: 'mitigate_comms_timing_risk',
        audit: 'audit_comms_schedule_signals',
        publish: 'publish_comms_schedule_status'
    },
    recommendationTargetMap: {
        schedule_comms_actions_by_risk: 'agent:comms',
        mitigate_comms_timing_risk: 'agent:risk',
        audit_comms_schedule_signals: 'agent:trust',
        publish_comms_schedule_status: 'agent:ops'
    }
});

export function scheduleCommsRiskAware(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsRiskAwareSchedulerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsRiskAwareScheduler extends BaseManager {}

export const __commsRiskAwareSchedulerInternals = toolkit.internals;
