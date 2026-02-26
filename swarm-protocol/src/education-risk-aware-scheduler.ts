import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_risk_aware_scheduler',
    collectionField: 'scheduleItems',
    idField: 'scheduleId',
    defaultName: 'Schedule Item',
    readyPosture: 'education_risk_schedule_ready',
    defaultAgentId: 'agent:education-scheduler',
    recommendationTypes: {
        primary: 'schedule_education_actions_by_risk',
        guard: 'mitigate_education_timing_risk',
        audit: 'audit_education_schedule_signals',
        publish: 'publish_education_schedule_status'
    },
    recommendationTargetMap: {
        schedule_education_actions_by_risk: 'agent:education',
        mitigate_education_timing_risk: 'agent:risk',
        audit_education_schedule_signals: 'agent:trust',
        publish_education_schedule_status: 'agent:ops'
    }
});

export function scheduleEducationRiskAware(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationRiskAwareSchedulerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationRiskAwareScheduler extends BaseManager {}

export const __educationRiskAwareSchedulerInternals = toolkit.internals;
