import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_risk_aware_scheduler',
    collectionField: 'scheduleItems',
    idField: 'scheduleId',
    defaultName: 'Schedule Item',
    readyPosture: 'impact_risk_schedule_ready',
    defaultAgentId: 'agent:impact-scheduler',
    recommendationTypes: {
        primary: 'schedule_impact_actions_by_risk',
        guard: 'mitigate_impact_timing_risk',
        audit: 'audit_impact_schedule_signals',
        publish: 'publish_impact_schedule_status'
    },
    recommendationTargetMap: {
        schedule_impact_actions_by_risk: 'agent:impact',
        mitigate_impact_timing_risk: 'agent:risk',
        audit_impact_schedule_signals: 'agent:trust',
        publish_impact_schedule_status: 'agent:ops'
    }
});

export function scheduleImpactRiskAware(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactRiskAwareSchedulerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactRiskAwareScheduler extends BaseManager {}

export const __impactRiskAwareSchedulerInternals = toolkit.internals;
