import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_risk_aware_scheduler',
    collectionField: 'scheduleItems',
    idField: 'scheduleId',
    defaultName: 'Rights Schedule Item',
    readyPosture: 'rights_risk_schedule_ready',
    defaultAgentId: 'agent:rights-scheduler',
    recommendationTypes: {
        primary: 'schedule_rights_actions_by_risk',
        guard: 'mitigate_rights_timing_risk',
        audit: 'audit_rights_schedule_signals',
        publish: 'publish_rights_schedule_status'
    },
    recommendationTargetMap: {
        schedule_rights_actions_by_risk: 'agent:rights',
        mitigate_rights_timing_risk: 'agent:risk',
        audit_rights_schedule_signals: 'agent:trust',
        publish_rights_schedule_status: 'agent:ops'
    }
});

export function scheduleRightsRiskAware(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsRiskAwareSchedulerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsRiskAwareScheduler extends BaseManager {}

export const __rightsRiskAwareSchedulerInternals = toolkit.internals;
