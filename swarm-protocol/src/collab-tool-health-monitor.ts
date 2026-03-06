import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_tool_health_monitor',
    collectionField: 'tools',
    idField: 'toolId',
    defaultName: 'Collab Tool',
    readyPosture: 'collab_tool_health_stable',
    defaultAgentId: 'agent:collab-tool-health',
    recommendationTypes: {
        primary: 'monitor_collab_tool_health',
        guard: 'mitigate_collab_tool_slo_risk',
        audit: 'audit_collab_tool_health_signals',
        publish: 'publish_collab_tool_health_status'
    },
    recommendationTargetMap: {
        monitor_collab_tool_health: 'agent:collab',
        mitigate_collab_tool_slo_risk: 'agent:reliability',
        audit_collab_tool_health_signals: 'agent:trust',
        publish_collab_tool_health_status: 'agent:ops'
    }
});

export function monitorCollabToolHealth(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabToolHealthMonitorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabToolHealthMonitor extends BaseManager {}

export const __collabToolHealthMonitorInternals = toolkit.internals;
