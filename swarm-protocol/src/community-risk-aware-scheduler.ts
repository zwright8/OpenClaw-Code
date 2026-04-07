import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_risk_aware_scheduler',
    collectionField: 'scheduleItems',
    idField: 'scheduleId',
    defaultName: 'Community Schedule Item',
    readyPosture: 'community_schedule_risk_balanced',
    defaultAgentId: 'agent:community-scheduler',
    recommendationTypes: {
        primary: 'schedule_community_risk_aware',
        guard: 'mitigate_community_schedule_risk',
        audit: 'audit_community_schedule_signals',
        publish: 'publish_community_schedule_status'
    },
    recommendationTargetMap: {
        schedule_community_risk_aware: 'agent:community',
        mitigate_community_schedule_risk: 'agent:risk',
        audit_community_schedule_signals: 'agent:trust',
        publish_community_schedule_status: 'agent:ops'
    }
});

export function scheduleCommunityRiskAware(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityRiskAwareSchedulerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityRiskAwareScheduler extends BaseManager {}

export const __communityRiskAwareSchedulerInternals = toolkit.internals;
