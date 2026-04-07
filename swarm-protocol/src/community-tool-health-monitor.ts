import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_tool_health_monitor',
    collectionField: 'tools',
    idField: 'toolId',
    defaultName: 'Community Tool',
    readyPosture: 'community_tool_health_stable',
    defaultAgentId: 'agent:community-tool-health',
    recommendationTypes: {
        primary: 'monitor_community_tool_health',
        guard: 'mitigate_community_tool_slo_risk',
        audit: 'audit_community_tool_health_signals',
        publish: 'publish_community_tool_health_status'
    },
    recommendationTargetMap: {
        monitor_community_tool_health: 'agent:community',
        mitigate_community_tool_slo_risk: 'agent:reliability',
        audit_community_tool_health_signals: 'agent:trust',
        publish_community_tool_health_status: 'agent:ops'
    }
});

export function monitorCommunityToolHealth(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityToolHealthMonitorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityToolHealthMonitor extends BaseManager {}

export const __communityToolHealthMonitorInternals = toolkit.internals;
