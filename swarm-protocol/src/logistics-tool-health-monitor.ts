import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_tool_health_monitor',
    collectionField: 'tools',
    idField: 'toolId',
    defaultName: 'Logistics Tool',
    readyPosture: 'logistics_tool_health_stable',
    defaultAgentId: 'agent:logistics-tool-health',
    recommendationTypes: {
        primary: 'monitor_logistics_tool_health',
        guard: 'mitigate_logistics_tool_slo_risk',
        audit: 'audit_logistics_tool_health_signals',
        publish: 'publish_logistics_tool_health_status'
    },
    recommendationTargetMap: {
        monitor_logistics_tool_health: 'agent:logistics',
        mitigate_logistics_tool_slo_risk: 'agent:reliability',
        audit_logistics_tool_health_signals: 'agent:trust',
        publish_logistics_tool_health_status: 'agent:ops'
    }
});

export function monitorLogisticsToolHealth(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsToolHealthMonitorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsToolHealthMonitor extends BaseManager {}

export const __logisticsToolHealthMonitorInternals = toolkit.internals;
