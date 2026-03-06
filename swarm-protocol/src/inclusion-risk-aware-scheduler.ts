import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_risk_aware_scheduler',
    collectionField: 'scheduleItems',
    idField: 'scheduleId',
    defaultName: 'Inclusion Schedule Item',
    readyPosture: 'inclusion_schedule_risk_balanced',
    defaultAgentId: 'agent:inclusion-scheduler',
    recommendationTypes: {
        primary: 'schedule_inclusion_risk_aware',
        guard: 'mitigate_inclusion_schedule_risk',
        audit: 'audit_inclusion_schedule_signals',
        publish: 'publish_inclusion_schedule_status'
    },
    recommendationTargetMap: {
        schedule_inclusion_risk_aware: 'agent:inclusion',
        mitigate_inclusion_schedule_risk: 'agent:risk',
        audit_inclusion_schedule_signals: 'agent:trust',
        publish_inclusion_schedule_status: 'agent:ops'
    }
});

export function scheduleInclusionRiskAware(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionRiskAwareSchedulerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionRiskAwareScheduler extends BaseManager {}

export const __inclusionRiskAwareSchedulerInternals = toolkit.internals;
