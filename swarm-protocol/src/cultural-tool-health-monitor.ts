import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_tool_health_monitor',
    collectionField: 'tools',
    idField: 'toolId',
    defaultName: 'Cultural Tool',
    readyPosture: 'cultural_tool_health_stable',
    defaultAgentId: 'agent:cultural-tool-health',
    recommendationTypes: {
        primary: 'monitor_cultural_tool_health',
        guard: 'mitigate_cultural_tool_slo_risk',
        audit: 'audit_cultural_tool_health_signals',
        publish: 'publish_cultural_tool_health_status'
    },
    recommendationTargetMap: {
        monitor_cultural_tool_health: 'agent:cultural',
        mitigate_cultural_tool_slo_risk: 'agent:reliability',
        audit_cultural_tool_health_signals: 'agent:trust',
        publish_cultural_tool_health_status: 'agent:ops'
    }
});

export function monitorCulturalToolHealth(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalToolHealthMonitorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalToolHealthMonitor extends BaseManager {}

export const __culturalToolHealthMonitorInternals = toolkit.internals;
