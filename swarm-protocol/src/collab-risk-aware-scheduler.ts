import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_risk_aware_scheduler',
    collectionField: 'scheduleItems',
    idField: 'scheduleId',
    defaultName: 'Collab Schedule Item',
    readyPosture: 'collab_risk_schedule_ready',
    defaultAgentId: 'agent:collab-scheduler',
    recommendationTypes: {
        primary: 'schedule_collab_actions_by_risk',
        guard: 'mitigate_collab_timing_risk',
        audit: 'audit_collab_schedule_signals',
        publish: 'publish_collab_schedule_status'
    },
    recommendationTargetMap: {
        schedule_collab_actions_by_risk: 'agent:collab',
        mitigate_collab_timing_risk: 'agent:risk',
        audit_collab_schedule_signals: 'agent:trust',
        publish_collab_schedule_status: 'agent:ops'
    }
});

export function scheduleCollabRiskAware(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabRiskAwareSchedulerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabRiskAwareScheduler extends BaseManager {}

export const __collabRiskAwareSchedulerInternals = toolkit.internals;
