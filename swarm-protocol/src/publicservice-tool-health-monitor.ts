import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_tool_health_monitor',
    collectionField: 'tools',
    idField: 'toolId',
    defaultName: 'PublicService Tool',
    readyPosture: 'publicservice_tool_health_stable',
    defaultAgentId: 'agent:publicservice-tool-health',
    recommendationTypes: {
        primary: 'monitor_publicservice_tool_health',
        guard: 'mitigate_publicservice_tool_slo_risk',
        audit: 'audit_publicservice_tool_health_signals',
        publish: 'publish_publicservice_tool_health_status'
    },
    recommendationTargetMap: {
        monitor_publicservice_tool_health: 'agent:publicservice',
        mitigate_publicservice_tool_slo_risk: 'agent:reliability',
        audit_publicservice_tool_health_signals: 'agent:trust',
        publish_publicservice_tool_health_status: 'agent:ops'
    }
});

export function monitorPublicServiceToolHealth(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceToolHealthMonitorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceToolHealthMonitor extends BaseManager {}

export const __publicServiceToolHealthMonitorInternals = toolkit.internals;
