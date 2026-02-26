import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_risk_aware_scheduler',
    collectionField: 'scheduleItems',
    idField: 'scheduleId',
    defaultName: 'Schedule Item',
    readyPosture: 'governance_risk_schedule_ready',
    defaultAgentId: 'agent:governance-scheduler',
    recommendationTypes: {
        primary: 'schedule_governance_actions_by_risk',
        guard: 'mitigate_governance_timing_risk',
        audit: 'audit_governance_schedule_signals',
        publish: 'publish_governance_schedule_status'
    },
    recommendationTargetMap: {
        schedule_governance_actions_by_risk: 'agent:governance',
        mitigate_governance_timing_risk: 'agent:risk',
        audit_governance_schedule_signals: 'agent:trust',
        publish_governance_schedule_status: 'agent:ops'
    }
});

export function scheduleGovernanceRiskAware(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceRiskAwareSchedulerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceRiskAwareScheduler extends BaseManager {}

export const __governanceRiskAwareSchedulerInternals = toolkit.internals;
