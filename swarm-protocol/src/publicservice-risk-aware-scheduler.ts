import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_risk_aware_scheduler',
    collectionField: 'scheduleItems',
    idField: 'scheduleId',
    defaultName: 'PublicService Schedule Item',
    readyPosture: 'publicservice_risk_schedule_ready',
    defaultAgentId: 'agent:publicservice-scheduler',
    recommendationTypes: {
        primary: 'schedule_publicservice_actions_by_risk',
        guard: 'mitigate_publicservice_timing_risk',
        audit: 'audit_publicservice_schedule_signals',
        publish: 'publish_publicservice_schedule_status'
    },
    recommendationTargetMap: {
        schedule_publicservice_actions_by_risk: 'agent:publicservice',
        mitigate_publicservice_timing_risk: 'agent:risk',
        audit_publicservice_schedule_signals: 'agent:trust',
        publish_publicservice_schedule_status: 'agent:ops'
    }
});

export function schedulePublicServiceRiskAware(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceRiskAwareSchedulerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceRiskAwareScheduler extends BaseManager {}

export const __publicServiceRiskAwareSchedulerInternals = toolkit.internals;
