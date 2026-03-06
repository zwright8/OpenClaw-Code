import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_risk_aware_scheduler',
    collectionField: 'scheduleItems',
    idField: 'scheduleId',
    defaultName: 'Cultural Schedule Item',
    readyPosture: 'cultural_schedule_risk_balanced',
    defaultAgentId: 'agent:cultural-scheduler',
    recommendationTypes: {
        primary: 'schedule_cultural_risk_aware',
        guard: 'mitigate_cultural_schedule_risk',
        audit: 'audit_cultural_schedule_signals',
        publish: 'publish_cultural_schedule_status'
    },
    recommendationTargetMap: {
        schedule_cultural_risk_aware: 'agent:cultural',
        mitigate_cultural_schedule_risk: 'agent:risk',
        audit_cultural_schedule_signals: 'agent:trust',
        publish_cultural_schedule_status: 'agent:ops'
    }
});

export function scheduleCulturalRiskAware(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalRiskAwareSchedulerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalRiskAwareScheduler extends BaseManager {}

export const __culturalRiskAwareSchedulerInternals = toolkit.internals;
