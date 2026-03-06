import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_tool_health_monitor',
    collectionField: 'tools',
    idField: 'toolId',
    defaultName: 'Crisis Tool',
    readyPosture: 'crisis_tool_health_stable',
    defaultAgentId: 'agent:crisis-tool-health',
    recommendationTypes: {
        primary: 'monitor_crisis_tool_health',
        guard: 'mitigate_crisis_tool_slo_risk',
        audit: 'audit_crisis_tool_health_signals',
        publish: 'publish_crisis_tool_health_status'
    },
    recommendationTargetMap: {
        monitor_crisis_tool_health: 'agent:crisis',
        mitigate_crisis_tool_slo_risk: 'agent:reliability',
        audit_crisis_tool_health_signals: 'agent:trust',
        publish_crisis_tool_health_status: 'agent:ops'
    }
});

export function monitorCrisisToolHealth(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisToolHealthMonitorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisToolHealthMonitor extends BaseManager {}

export const __crisisToolHealthMonitorInternals = toolkit.internals;
