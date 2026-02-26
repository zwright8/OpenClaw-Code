import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_risk_aware_scheduler',
    collectionField: 'scheduleItems',
    idField: 'scheduleId',
    defaultName: 'Schedule Item',
    readyPosture: 'federation_risk_schedule_ready',
    defaultAgentId: 'agent:federation-scheduler',
    recommendationTypes: {
        primary: 'schedule_federation_actions_by_risk',
        guard: 'mitigate_federation_timing_risk',
        audit: 'audit_federation_schedule_signals',
        publish: 'publish_federation_schedule_status'
    },
    recommendationTargetMap: {
        schedule_federation_actions_by_risk: 'agent:federation',
        mitigate_federation_timing_risk: 'agent:risk',
        audit_federation_schedule_signals: 'agent:trust',
        publish_federation_schedule_status: 'agent:ops'
    }
});

export function scheduleFederationRiskAware(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationRiskAwareSchedulerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationRiskAwareScheduler extends BaseManager {}

export const __federationRiskAwareSchedulerInternals = toolkit.internals;
